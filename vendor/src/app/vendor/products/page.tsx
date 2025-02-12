"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import withAuth from "@/lib/withAuth";
import { useGetStores } from '@/app/hooks/store/useGetStores';
import ProductGallery from '../components/productgallery/page';
import {ProductUploadForm} from "../components/ProductUploadForm/ProductUploadForm"

const Product = () => {
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { data: stores, isLoading, error } = useGetStores();
  const router = useRouter();

  const handleAddProductClick = () => {
    if (!stores || stores.length === 0) {
      setIsStoreDialogOpen(true);
    } else {
      setIsStoreDialogOpen(true);
    }
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setIsStoreDialogOpen(false);
    setIsOptionDialogOpen(true);
  };

  const handleOptionSelect = (option) => {
    setIsOptionDialogOpen(false);
    if (option === "customizable") {
      const { store_url, vendor_id } = selectedStore;
      const storeUrl = `${store_url}/${vendor_id}`;
      window.open(storeUrl, '_blank');
    } else {
      setIsFormOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">Product Management</h1>
      
      <Button onClick={handleAddProductClick} className="mb-6">
        Add Product
      </Button>

      {/* Store Selection Dialog */}
      <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!stores || stores.length === 0 ? "Create a Store" : "Select a Store"}
            </DialogTitle>
            <DialogDescription>
              {!stores || stores.length === 0 ? (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Stores Found</AlertTitle>
                  <AlertDescription>
                    You need to create a store before adding products.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4 mt-4">
                  {stores.map((store) => (
                    <Card 
                      key={store.id} 
                      className="hover:bg-accent cursor-pointer"
                      onClick={() => handleStoreSelect(store)}
                    >
                      <CardHeader>
                        <CardTitle>{store.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{store.store_url}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Option Selection Dialog */}
      <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Product Type</DialogTitle>
            <DialogDescription>
              Choose whether the product should be customizable or non-customizable.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4 mt-4">
            <Button onClick={() => handleOptionSelect("customizable")}>
              Customizable
            </Button>
            <Button onClick={() => handleOptionSelect("non-customizable")}>
              Non-Customizable
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Upload Form for Non-Customizable */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Product</DialogTitle>
            <DialogDescription>
              Provide details like size, color, and other attributes for the product.
            </DialogDescription>
          </DialogHeader>
          <ProductUploadForm />
        </DialogContent>
      </Dialog>
      
      <ProductGallery />
    </div>
  );
};

export default withAuth(Product);
