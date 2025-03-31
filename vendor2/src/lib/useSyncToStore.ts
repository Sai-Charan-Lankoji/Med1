// import { useEffect } from 'react';

// /**
//  * Utility to sync SWR data to Zustand store
//  * @param data The data from SWR hook
//  * @param isLoading Loading state from SWR
//  * @param error Error state from SWR
//  * @param syncFunction The store function that will receive the data
//  */
// export function useSyncToStore<T>(
//   data: T | undefined,
//   isLoading: boolean,
//   error: Error | null,
//   syncFunction: (data: T) => void
// ) {
//   useEffect(() => {
//     if (!isLoading && data && !error) {
//       syncFunction(data);
//     }
//   }, [data, isLoading, error, syncFunction]);
  
//   return { isLoading, error };
// }