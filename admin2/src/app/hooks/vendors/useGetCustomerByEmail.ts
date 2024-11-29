import { useQuery } from '@tanstack/react-query';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


const fetchCustomerByEmail = async (email: string) => {
  const url = `${baseUrl}/vendor/customers?email=${email}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch customer details: ${response.status}`);
  }

  const data = await response.json();
  console.log("useGetCustomerByEmail Details Hook: ", data)
  return data;
};

export const useGetCustomerByEmail = (email: string) => {
  return useQuery(['customers', email], () => fetchCustomerByEmail(email), {
    onError: (error) => {
      console.error('Error fetching customer details:', error);
    },
  });
};
