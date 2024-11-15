// context/SvgContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// interface SvgItem {
//   url: string;
//   designItem: string; // Modify this based on your actual design item type
//   id: string;
//   isNew: boolean;
// }  


interface SvgContextType {
//   svgItems: SvgItem[]; // Array of SVG items
//   addSvgItem: (item: SvgItem) => void; // Function to add SVG items
  clearSvgItems: () => void; // Function to clear all SVG items
  isSvgUploaded: boolean; // Flag to check if any SVG is uploaded
  svgUrl: string | null; // To hold the current SVG URL
  setSvgUrl: (url: string | null) => void; // Function to set the SVG URL
}

const SvgContext = createContext<SvgContextType | undefined>(undefined);

export const SvgProvider = ({ children }: { children: ReactNode }) => {
//   const [svgItems, setSvgItems] = useState<SvgItem[]>([]);
  const [isSvgUploaded, setIsSvgUploaded] = useState<boolean>(false);
  const [svgUrl, setSvgUrl] = useState<string | null>(null); // State to hold the current SVG URL

  
  // Add SVG item and update sessionStorage
//   const addSvgItem = (item: SvgItem) => {
//     setSvgItems((prevItems) => {
//       const updatedItems = [...prevItems, item];
//       return updatedItems;
//     });
//     setIsSvgUploaded(true);
//   }; 

  // Clear all SVG items
  const clearSvgItems = () => {
    // setSvgItems([]);
    setIsSvgUploaded(false); // Reset upload flag
    setSvgUrl(null); // Reset SVG URL
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
