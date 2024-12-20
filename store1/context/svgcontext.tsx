
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';




interface SvgContextType {
  clearSvgItems: () => void; 
  isSvgUploaded: boolean; 
  svgUrl: string | null;
  setSvgUrl: (url: string | null) => void; 
}

const SvgContext = createContext<SvgContextType | undefined>(undefined);

export const SvgProvider = ({ children }: { children: ReactNode }) => {
  const [isSvgUploaded, setIsSvgUploaded] = useState<boolean>(false);
  const [svgUrl, setSvgUrl] = useState<string | null>(null); 


  const clearSvgItems = () => {
    setIsSvgUploaded(false); 
    setSvgUrl(null); 
  };

  return (
    <SvgContext.Provider value={{   clearSvgItems, isSvgUploaded, svgUrl, setSvgUrl }}>
      {children}
    </SvgContext.Provider>
  );
};

export const useSvgContext = () => {
  const context = useContext(SvgContext);
  if (!context) {
    throw new Error('useSvgContext must be used within a SvgProvider');
  }
  return context;
};
