import { useState } from 'react';
import { Discount } from '@/app/@types/discount';

const useCreateDiscount = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createDiscount = async (discountData: Omit<Discount, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/admin/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discountData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while creating the discount');
      }
    } finally {
      setLoading(false);
    }
  };

  return { createDiscount, loading, error };
};

export default useCreateDiscount;