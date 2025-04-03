'use client';

import { useGetStore } from '@/app/hooks/useGetStoreURL';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StoreContextType {
    store: any; // Replace `any` with the actual type of your `store` object
    isLoading: boolean;
}

// Create the context
const StoreContext = createContext<StoreContextType>({
    store: null,
    isLoading: true,
});

// Create the provider component
export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [store, setStore] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [origin, setOrigin] = useState<string>("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin); // Safely access window on the client side
        }
    }, []);

    const { data, isLoading: fetchLoading } = useGetStore(origin);
    console.log("store URL: ", origin);

    useEffect(() => {
        if (!fetchLoading && data) {
            setStore(data);
            setIsLoading(false);
        }
    }, [data, fetchLoading]);

    return (
        <StoreContext.Provider value={{ store, isLoading }}>
            {children}
        </StoreContext.Provider>
    );
};

// Custom hook to use the store context
export const useStore = () => useContext(StoreContext);
