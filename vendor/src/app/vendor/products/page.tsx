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
import ProductGallery from '../components/productgallery/page'

const Product = () => {
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const { data: stores, isLoading, error } = useGetStores();
  const router = useRouter();

  const handleAddProductClick = () => {
    if (!stores || stores.length === 0) {
      // No stores exist, show create store alert
      setIsStoreDialogOpen(true);
    } else {
      // Stores exist, show store selection dialog
      setIsStoreDialogOpen(true);
    }
  };

  const handleStoreSelect = (store) => {
    // Extract store details
    const { store_url, vendor_id } = store;
    const id = vendor_id
    // Construct the URL with vendor ID as a path parameter
    const storeUrl = `${store_url}/${id}`;
    
    // Open the store URL in a new tab/window
    window.open(storeUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>
      
      <Button onClick={handleAddProductClick} className="mb-6">
        Add Product
      </Button>

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
      <ProductGallery />
    </div>
  );
};

export default withAuth(Product);