'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Loading from './loading';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  wrapAsync: <T>(asyncFunction: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStack, setLoadingStack] = useState(0);

  const showLoading = () => {
    setLoadingStack(prev => prev + 1);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setLoadingStack(prev => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        setIsLoading(false);
        return 0;
      }
      return newCount;
    });
  };

  const wrapAsync = async <T,>(asyncFunction: () => Promise<T>): Promise<T> => {
    try {
      showLoading();
      return await asyncFunction();
    } finally {
      hideLoading();
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, wrapAsync }}>
      <div className="relative min-h-screen">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-50">
            <div className="text-center">
              <Loading  />
              <p className="mt-2 text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        )}
        {children}
      </div>
    </LoadingContext.Provider>
  );
};