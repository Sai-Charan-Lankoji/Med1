// import { useGetUsers } from '@/app/hooks/users/useGetUsers';
// import { useUsersStore } from '@/store/slices/userSlice';
// import { useSyncToStore } from '@/lib/useSyncToStore';
// import { useEffect } from 'react';

// export function useSyncedUsers() {
//   // Get data from SWR
//   const { data: users, isLoading, error, refetch } = useGetUsers();
  
//   // Get Zustand store functions
//   const { 
//     setUsers, 
//     updateLoadingState, 
//     getFilteredUsers, 
//     userFilters, 
//     setUserFilters 
//   } = useUsersStore();
  
//   // Sync users data
//   useSyncToStore(users, isLoading, error, setUsers);
  
//   // Update loading state
//   useEffect(() => {
//     updateLoadingState(isLoading);
//   }, [isLoading, updateLoadingState]);
  
//   return {
//     // Original SWR data
//     users,
//     isLoading,
//     error,
//     refetch,
    
//     // Zustand-powered features
//     filteredUsers: getFilteredUsers?.() || users,
//     filters: userFilters,
//     setFilters: setUserFilters
//   };
// }