"use client";

import * as React from "react";
import {
  IDesign,
  DesignAction,
  designApparels,
  IProps,
  PropsAction,
} from "../@types/models";
import { designReducer, propsReducer } from "../reducer/designreducer";
import { useSvgContext } from "@/context/svgcontext";

const defaultDesignState: IDesign[] = [{
  apparel: {
    side: designApparels[0].side,
    url: designApparels[0].url,
    color: designApparels[0].color,
    width: designApparels[0].width,
    height: designApparels[0].height,
    selected: designApparels[0].selected,
  },
  id: 1,
  items: [],
  jsonDesign: null,
  isactive: true,
  pngImage: null,
  svgImage: null,
  uploadedImages: [],
}];

const defaultPropsState: IProps = {
  fill: "",
  underline: false,
  overline: false,
  backgroundColor: "transparent",
  borderColor: "",
  fontSize: 12,
  lineHeight: 0.8,
  charSpacing: 40,
  fontWeight: "200",
  fontStyle: "normal",
  textAlign: "left",
  fontFamily: "Fresca",
  textDecoration: "none",
  drawMode: false,
  linethrough: false,
  bgColor: "#ffffff",
  fillcolor: "#5521b4",
};

export const DesignContext = React.createContext<{
  designs: IDesign[];
  dispatchDesign: React.Dispatch<DesignAction>;
  saveState: () => void;
  clearSavedState: () => void;
  currentBgColor: string;
  updateColor: (color: string) => void;
} | null>(null);

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { svgUrl } = useSvgContext();
  const [isClient, setIsClient] = React.useState(false);
  const [designs, dispatchDesign] = React.useReducer(designReducer, defaultDesignState);
  const [currentBgColor, setCurrentBgColor] = React.useState<string>(defaultDesignState[0].apparel.color);
  
  // Handle hydration by waiting for client-side render
  React.useEffect(() => {
    setIsClient(true);
    
    // Load saved state after component mounts
    const savedState = localStorage.getItem('savedDesignState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatchDesign({ type: "UPLOADED_DESIGNS", payload: parsedState });
        const activeDesign = parsedState.find((d: IDesign) => d.isactive);
        if (activeDesign?.apparel?.color) {
          setCurrentBgColor(activeDesign.apparel.color);}
      } catch (error) {
        console.error('Error loading design state:', error);
      }
    }
  }, []);

  const saveState = React.useCallback(() => {
    if (isClient) {
      localStorage.setItem('savedDesignState', JSON.stringify(designs));
    }
  }, [designs, isClient]);

  const clearSavedState = React.useCallback(() => {
    if (isClient) {
      localStorage.removeItem('savedDesignState');
    }
  }, [isClient]);

  const updateColor = React.useCallback((color: string) => {
    setCurrentBgColor(color);
    dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: color });
  }, []);


  React.useEffect(() => {
    if (isClient && designs.some(design => design.jsonDesign !== null)) {
      saveState();
    }
  }, [designs, saveState, isClient]);

  return (
    <DesignContext.Provider value={{ 
      designs, 
      dispatchDesign, 
      saveState, 
      clearSavedState ,
      currentBgColor,
      updateColor,
    }}>
      {children}
    </DesignContext.Provider>
  );
};

export const TextPropsContext = React.createContext<{
  props: IProps;
  dispatchProps: React.Dispatch<PropsAction>;
  savePropsState: () => void;
  clearSavedPropsState: () => void;
} | null>(null);

export const TextPropsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = React.useState(false);
  const [props, dispatchProps] = React.useReducer(propsReducer, defaultPropsState);

  // Handle hydration by waiting for client-side render
  React.useEffect(() => {
    setIsClient(true);
    
    // Load saved state after component mounts
    const savedState = localStorage.getItem('savedPropsState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatchProps({ type: "SELECTED_PROPS", payload: parsedState });
      } catch (error) {
        console.error('Error loading props state:', error);
      }
    }
  }, []);

  const savePropsState = React.useCallback(() => {
    if (isClient) {
      localStorage.setItem('savedPropsState', JSON.stringify(props));
    }
  }, [props, isClient]);

  const clearSavedPropsState = React.useCallback(() => {
    if (isClient) {
      localStorage.removeItem('savedPropsState');
    }
  }, [isClient]);

  React.useEffect(() => {
    if (isClient) {
      savePropsState();
    }
  }, [props, savePropsState, isClient]);

  return (
    <TextPropsContext.Provider value={{ 
      props, 
      dispatchProps, 
      savePropsState, 
      clearSavedPropsState 
    }}>
      {children}
    </TextPropsContext.Provider>
  );
};

export const useDesign = () => {
  const context = React.useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};

export const useTextProps = () => {
  const context = React.useContext(TextPropsContext);
  if (!context) {
    throw new Error('useTextProps must be used within a TextPropsProvider');
  }
  return context;
};