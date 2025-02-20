import { useState } from 'react';
import { Discount } from '@/app/@types/discount';

const useUpdateDiscount = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateDiscount = async (id: string, discountData: Partial<Discount>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/discount/${id}`, {
        method: 'PUT',
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
        setError('An error occurred while updating the discount');
      }
    } finally {
      setLoading(false);
    }
  };

  return { updateDiscount, loading, error };
};

export default useUpdateDiscount;