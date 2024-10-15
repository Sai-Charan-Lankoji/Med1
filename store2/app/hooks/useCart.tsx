// hooks/useCart.ts
import { useState, useEffect } from 'react';
import { LineItem } from '@medusajs/medusa';
import axios from 'axios';

const useCart = (customerId: string) => {
  const [cart, setCart] = useState<any>(null); // Replace 'any' with your cart type
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/cart?customerId=${customerId}`);
      setCart(response.data.cart);
    } catch (error : any) { 
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (lineItems: LineItem[]) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/cart', {
        customer_id: customerId,
        lineItems,
      });
      setCart(response.data.cart);
    } catch (error : any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      getCart();
    }
  }, [customerId]);

  return { cart, loading, error, addToCart };
};

export default useCart;
