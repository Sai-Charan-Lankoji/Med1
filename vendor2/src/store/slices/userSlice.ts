import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { UserResponseData, UserRoles } from '@/app/@types/user';

interface UsersState {
  // Data
  users: UserResponseData[];
  userFilters: {
    role: UserRoles | 'all';
    status: string;
    searchTerm: string;
  };
  
  // Loading state
  loading: boolean;
  error: Error | null;
  
  // Actions
  setUsers: (users: UserResponseData[]) => void;
  setUserFilters: (filters: Partial<UsersState['userFilters']>) => void;
  updateLoadingState: (isLoading: boolean) => void;
  updateErrorState: (error: Error | null) => void;
  
  // Computed values
  getFilteredUsers: () => UserResponseData[];
}

export const useUsersStore = create<UsersState>()(
  immer((set, get) => ({
    // Data
    users: [],
    userFilters: {
      role: 'all',
      status: 'all',
      searchTerm: '',
    },
    
    // Loading state
    loading: false,
    error: null,
    
    // Actions
    setUsers: (users) => {
      set((state) => {
        state.users = users;
      });
    },
    
    setUserFilters: (filters) => {
      set((state) => {
        state.userFilters = { ...state.userFilters, ...filters };
      });
    },
    
    updateLoadingState: (isLoading) => {
      set((state) => {
        state.loading = isLoading;
      });
    },
    
    updateErrorState: (error) => {
      set((state) => {
        state.error = error;
      });
    },
    
    // Computed values
    getFilteredUsers: () => {
      const { users, userFilters } = get();
      const { role, status, searchTerm } = userFilters;
      
      return users.filter(user => {
        // Filter by role
        if (role !== 'all' && user.role !== role) {
          return false;
        }
        
        // Filter by status
        if (status !== 'all') {
          const isActive = !user.deleted_at;
          if ((status === 'active' && !isActive) || (status === 'expired' && isActive)) {
            return false;
          }
        }
        
        // Filter by search term
        if (searchTerm && !(
          user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )) {
          return false;
        }
        
        return true;
      });
    }
  }))
);