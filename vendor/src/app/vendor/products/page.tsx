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
import { Settings, Package } from 'lucide-react';

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
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Select Product Type</DialogTitle>
      <DialogDescription>
        Choose whether the product should be customizable or non-customizable.
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-center items-stretch gap-6 mt-6">
      <Button
        onClick={() => handleOptionSelect("customizable")}
        className="flex flex-col items-center justify-center w-40 h-40 p-4 hover:scale-105 transition-transform"
        variant="outline"
      >
        <div className="flex flex-col items-center gap-4">
          <Settings className="h-16 w-16" />
          <span className="text-sm font-medium">Customizable</span>
        </div>
      </Button>
      <Button
        onClick={() => handleOptionSelect("non-customizable")}
        className="flex flex-col items-center justify-center w-40 h-40 p-4 hover:scale-105 transition-transform"
        variant="outline"
      >
        <div className="flex flex-col items-center gap-4">
          <Package className="h-16 w-16" />
          <span className="text-sm font-medium">Non-Customizable</span>
        </div>
      </Button>
    </div>
  </DialogContent>
</Dialog>

      {/* Product Upload Form for Non-Customizable */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
  <DialogContent className="max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Upload Product</DialogTitle>
      <DialogDescription>
        Provide product details below
      </DialogDescription>
    </DialogHeader>
    <ProductUploadForm onClose={() => setIsFormOpen(false)} store={selectedStore} />
  </DialogContent>
</Dialog>
      
      <ProductGallery />
    </div>
  );
};

export default withAuth(Product);
