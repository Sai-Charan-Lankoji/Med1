import useSWR from 'swr';
import { vendor_id } from '@/app/utils/constant';
import { Next_server } from '@/constant';

const baseUrl = Next_server;

// Custom products fetcher
const fetchProducts = async (url: string) => {
  if (!vendor_id) {
    console.log('No vendor ID found in sessionStorage');
    return [];
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
      if (response.status === 404 || response.status === 500) {
        console.log('No products found or server error. Returning empty array.');
        return [];
      }
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    // Handle nested response (e.g., { success: true, data: [...] }) or direct array
    const productsData = data.data || data;
    return Array.isArray(productsData) ? productsData : [];
  } catch (error) {
    console.error('Error fetching custom products:', error);
    return [];
  }
};

// Standard products fetcher
const fetchStandardProducts = async (url: string) => {
  if (!vendor_id) {
    console.log('No vendor ID found in sessionStorage');
    return [];
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}, ${data.error}`);
      if (response.status === 404 || response.status === 500) {
        console.log('No standard products found or server error. Returning empty array.');
        return [];
      }
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    const productsData = data.products || data;
    return Array.isArray(productsData) ? productsData : [];
  } catch (error) {
    console.error('Error fetching standard products:', error);
    return [];
  }
};

export const useGetProducts = () => {
  // Custom products query
  const customProductsUrl = vendor_id ? `${baseUrl}/api/products/vendor/${vendor_id}` : null;
  const { 
    data: customProducts, 
    error: customError, 
    isLoading: isCustomLoading, 
    mutate: refetchCustom 
  } = useSWR(customProductsUrl, fetchProducts, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    dedupingInterval: 5 * 60 * 1000,
    errorRetryCount: 0,
  });

  // Standard products query
  const standardProductsUrl = vendor_id ? `${baseUrl}/api/standardproducts/vendor/${vendor_id}` : null;
  const { 
    data: standardProducts, 
    error: standardError, 
    isLoading: isStandardLoading,
    mutate: refetchStandard
  } = useSWR(standardProductsUrl, fetchStandardProducts, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    dedupingInterval: 5 * 60 * 1000,
    errorRetryCount: 0,
  });

  // Combined refetch function
  const refetchAll = async () => {
    const results = await Promise.all([
      refetchCustom(),
      refetchStandard()
    ]);
    return results;
  };

  return {
    // Individual product types
    customProducts: Array.isArray(customProducts) ? customProducts : [],
    standardProducts: Array.isArray(standardProducts) ? standardProducts : [],
    
    // Combined data (for convenience)
    allProducts: {
      custom: Array.isArray(customProducts) ? customProducts : [],
      standard: Array.isArray(standardProducts) ? standardProducts : [],
    },
    
    // Loading states
    isLoading: {
      custom: isCustomLoading,
      standard: isStandardLoading,
      any: isCustomLoading || isStandardLoading
    },
    
    // Error states
    error: {
      custom: customError,
      standard: standardError,
      any: customError || standardError
    },
    
    // Refetch functions
    refetch: {
      custom: refetchCustom,
      standard: refetchStandard,
      all: refetchAll
    }
  };
};