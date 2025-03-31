// import { create } from 'zustand';
// import { immer } from 'zustand/middleware/immer';

// interface ProductsState {
//   // Data
//   customProducts: any[];
//   standardProducts: any[];
//   productFilters: {
//     storeId: string | null;
//     category: string | null;
//     searchTerm: string;
//     sortBy: string;
//   };
  
//   // Loading state
//   loading: {
//     customProducts: boolean;
//     standardProducts: boolean;
//     any: boolean;
//   };
//   error: {
//     customProducts: Error | null;
//     standardProducts: Error | null;
//     any: boolean;
//   };
  
//   // Actions
//   setCustomProducts: (products: any[]) => void;
//   setStandardProducts: (products: any[]) => void;
//   setProductFilters: (filters: Partial<ProductsState['productFilters']>) => void;
//   updateLoadingState: (key: keyof ProductsState['loading'], value: boolean) => void;
//   updateErrorState: (key: keyof ProductsState['error'], value: Error | null) => void;
  
//   // Computed values
//   getProductsByStore: (storeId: string) => {
//     customProducts: any[];
//     standardProducts: any[];
//   };
//   getFilteredProducts: () => {
//     customProducts: any[];
//     standardProducts: any[];
//   };
// }

// export const useProductsStore = create<ProductsState>()(
//   immer((set, get) => ({
//     // Data
//     customProducts: [],
//     standardProducts: [],
//     productFilters: {
//       storeId: null,
//       category: null,
//       searchTerm: '',
//       sortBy: 'newest',
//     },
    
//     // Loading state
//     loading: {
//       customProducts: false,
//       standardProducts: false,
//       get any() {
//         return this.customProducts || this.standardProducts;
//       },
//     },
//     error: {
//       customProducts: null,
//       standardProducts: null,
//       get any() {
//         return !!(this.customProducts || this.standardProducts);
//       },
//     },
    
//     // Actions
//     setCustomProducts: (products) => {
//       set((state) => {
//         state.customProducts = products;
//       });
//     },
//     setStandardProducts: (products) => {
//       set((state) => {
//         state.standardProducts = products;
//       });
//     },
//     setProductFilters: (filters) => {
//       set((state) => {
//         state.productFilters = { ...state.productFilters, ...filters };
//       });
//     },
//     updateLoadingState: (key, value) => {
//       set((state) => {
//         state.loading[key] = value;
//       });
//     },
//     updateErrorState: (key, value) => {
//       set((state) => {
//         state.error[key] = value;
//       });
//     },
    
//     // Computed values
//     getProductsByStore: (storeId) => {
//       const { customProducts, standardProducts } = get();
      
//       return {
//         customProducts: customProducts.filter(p => p.store_id === storeId),
//         standardProducts: standardProducts.filter(p => p.store_id === storeId),
//       };
//     },
//     getFilteredProducts: () => {
//       const { customProducts, standardProducts, productFilters } = get();
//       const { storeId, category, searchTerm, sortBy } = productFilters;
      
//       // Apply filters
//       let filteredCustom = customProducts;
//       let filteredStandard = standardProducts;
      
//       if (storeId) {
//         filteredCustom = filteredCustom.filter(p => p.store_id === storeId);
//         filteredStandard = filteredStandard.filter(p => p.store_id === storeId);
//       }
      
//       if (category) {
//         filteredCustom = filteredCustom.filter(p => p.category === category);
//         filteredStandard = filteredStandard.filter(p => p.category === category);
//       }
      
//       if (searchTerm) {
//         const term = searchTerm.toLowerCase();
//         filteredCustom = filteredCustom.filter(p => 
//           p.title?.toLowerCase().includes(term) || 
//           p.description?.toLowerCase().includes(term)
//         );
//         filteredStandard = filteredStandard.filter(p => 
//           p.title?.toLowerCase().includes(term) || 
//           p.description?.toLowerCase().includes(term)
//         );
//       }
      
//       // Apply sorting
//       const sortProducts = (products) => {
//         return [...products].sort((a, b) => {
//           switch (sortBy) {
//             case 'newest':
//               return new Date(b.createdAt || b.created_at).getTime() - 
//                      new Date(a.createdAt || a.created_at).getTime();
//             case 'oldest':
//               return new Date(a.createdAt || a.created_at).getTime() - 
//                      new Date(b.createdAt || b.created_at).getTime();
//             case 'priceAsc':
//               return (a.price || 0) - (b.price || 0);
//             case 'priceDesc':
//               return (b.price || 0) - (a.price || 0);
//             default:
//               return 0;
//           }
//         });
//       };
      
//       return {
//         customProducts: sortProducts(filteredCustom),
//         standardProducts: sortProducts(filteredStandard),
//       };
//     }
//   }))
// );