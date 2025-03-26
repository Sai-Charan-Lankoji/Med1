"use client";

import React, { useState } from "react";
import withAuth from "@/lib/withAuth";
import ProductGallery from "../components/productgallery/page";
import { Plus, Settings, Package, AlertCircle } from "lucide-react";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { useToast } from "@/hooks/use-toast";
import { ProductUploadForm } from "../components/ProductUploadForm/ProductUploadForm";

// Section: Store Selection Modal
const StoreSelectionModal = ({ isOpen, onClose, stores, onStoreSelect }) => {
  return (
    <dialog id="store-modal" className="modal" open={isOpen}>
      <div className="modal-box">
        <h3 className="text-lg font-bold text-primary">
          {(!stores || stores.length === 0) ? "Create a Store" : "Select a Store"}
        </h3>
        {(!stores || stores.length === 0) ? (
          <div role="alert" className="alert alert-error alert-dash mt-4">
            <AlertCircle className="h-4 w-4" />
            <span>No Stores Found. You need to create a store before adding products.</span>
          </div>
        ) : (
          <div className="grid gap-4 mt-4 sm:grid-cols-1 md:grid-cols-2">
            {stores.map((store) => (
              <div
                key={store.id}
                className="card card-border bg-base-100 hover:bg-base-200 cursor-pointer transition-all duration-200"
                onClick={() => onStoreSelect(store)}
              >
                <div className="card-body p-4">
                  <h4 className="card-title text-base">{store.name}</h4>
                  <p className="text-base-content/70 text-sm">{store.store_url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="modal-action">
          <button className="btn  btn-error" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="btn  btn-error" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

// Section: Option Selection Modal
const OptionSelectionModal = ({ isOpen, onClose, onOptionSelect }) => {
  return (
    <dialog id="option-modal" className="modal" open={isOpen}>
      <div className="modal-box max-w-md">
        <h3 className="text-lg font-bold text-primary">Select Product Type</h3>
        <p className="text-base-content/70 mt-2">
          Choose whether the product should be customizable or non-customizable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-6">
          <button
            className="btn btn-outline btn-dash flex flex-col items-center justify-center w-full sm:w-40 h-40 p-4 hover:scale-105 transition-transform"
            onClick={() => onOptionSelect("customizable")}
          >
            <Settings className="h-12 w-12 sm:h-16 sm:w-16" />
            <span className="text-sm font-medium mt-2">Customizable</span>
          </button>
          <button
            className="btn btn-outline btn-dash flex flex-col items-center justify-center w-full sm:w-40 h-40 p-4 hover:scale-105 transition-transform"
            onClick={() => onOptionSelect("non-customizable")}
          >
            <Package className="h-12 w-12 sm:h-16 sm:w-16" />
            <span className="text-sm font-medium mt-2">Non-Customizable</span>
          </button>
        </div>
        <div className="modal-action">
          <button className="btn  btn-error" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

// Section: Product Upload Form Modal
const ProductFormModal = ({ isOpen, onClose, productType, store }) => {
  return (
    <dialog id="form-modal" className="modal" open={isOpen}>
      <div className="modal-box max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-primary">
          {productType === "customizable" ? "Create Custom Product" : "Upload Product"}
        </h3>
        <ProductUploadForm
          onClose={onClose}
          store={store}
          productType={productType}
        />
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

// Main Product Page
const Product = () => {
  const { data: stores, isLoading, error } = useGetStores();
  const { toast } = useToast();
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [productType, setProductType] = useState(null);

  const handleAddProductClick = () => {
    if (!stores || stores.length === 0) {
      toast({
        title: "No Stores",
        description: "You need to create a store before adding products.",
        variant: "destructive",
      });
      setIsStoreModalOpen(true);
    } else {
      setIsStoreModalOpen(true);
    }
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setIsStoreModalOpen(false);
    setIsOptionModalOpen(true);
  };

  const handleOptionSelect = (option) => {
    setProductType(option);
    setIsOptionModalOpen(false);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setProductType(null);
    setSelectedStore(null);
  };

  return (
    <div className="p-4 md:p-6 container mx-auto bg-neutral-50 h-vh w-dvw">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-4 sm:mb-0">
          Product Management
        </h1>

        <button className="btn btn-primary btn-soft" onClick={handleAddProductClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : error ? (
        <div role="alert" className="alert alert-error alert-soft">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load stores</span>
        </div>
      ) : (
        <ProductGallery />
      )}

      <StoreSelectionModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        stores={stores}
        onStoreSelect={handleStoreSelect}
      />

      <OptionSelectionModal
        isOpen={isOptionModalOpen}
        onClose={() => setIsOptionModalOpen(false)}
        onOptionSelect={handleOptionSelect}
      />

      {isFormOpen && (
        <ProductFormModal
          isOpen={isFormOpen}
          onClose={handleFormClose}
          productType={productType}
          store={selectedStore}
        />
      )}
    </div>
  );
};

export default withAuth(Product);