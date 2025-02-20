import { useState, useEffect } from 'react';
import { Discount } from '@/app/@types/discount';

const useGetDiscount = () => {
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/discount');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Discount = await response.json();
        setDiscount(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDiscount();
  }, []);

  return { discount, loading, error };
};

export default useGetDiscount;