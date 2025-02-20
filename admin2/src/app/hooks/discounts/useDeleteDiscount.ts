import { useState } from 'react';

const useDeleteDiscount = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDiscount = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/discount/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while deleting the discount');
      }
    } finally {
      setLoading(false);
    }
  };

  return { deleteDiscount, loading, error };
};

export default useDeleteDiscount;