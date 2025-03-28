import { useGetProducts } from '@/app/hooks/products/useGetProducts';
import { useProductsStore } from '@/store/slices/productSlice';
import { useSyncToStore } from '@/lib/useSyncToStore';
import { useEffect } from 'react';

export function useSyncedProducts() {
  // Get data from SWR hooks
  const {
    customProducts,
    standardProducts,
    isLoading,
    error,
    refetch
  } = useGetProducts();
  
  // Get Zustand store functions
  const { 
    setCustomProducts,
    setStandardProducts,
    updateLoadingState,
    updateErrorState,
    getFilteredProducts,
    productFilters,
    setProductFilters
  } = useProductsStore();
  
  // Sync custom products
  useSyncToStore(
    customProducts, 
    isLoading?.custom || false, 
    error?.custom || null, 
    setCustomProducts
  );
  
  // Sync standard products
  useSyncToStore(
    standardProducts,
    isLoading?.standard || false,
    error?.standard || null,
    setStandardProducts
  );
  
  // Update loading states
  useEffect(() => {
    if (isLoading?.custom !== undefined) {
      updateLoadingState('customProducts', isLoading.custom);
    }
    if (isLoading?.standard !== undefined) {
      updateLoadingState('standardProducts', isLoading.standard);
    }
  }, [isLoading, updateLoadingState]);
  
  return {
    // Original SWR data and functions
    customProducts,
    standardProducts,
    isLoading,
    error,
    refetch,
    
    // Zustand-powered features
    filteredProducts: getFilteredProducts(),
    filters: productFilters,
    setFilters: setProductFilters
  };
}