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

export const DesignContext = React.createContext<{
  designs: IDesign[];
  dispatchDesign: React.Dispatch<DesignAction>;
} | null>(null);

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [designs, dispatchDesign] = React.useReducer(designReducer, [
    {
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
    },
  ]); 

  
  React.useEffect(() => {
    console.log("Current designs state:", designs); // Log designs state
  }, [designs]); 



  return (
    <DesignContext.Provider value={{ designs, dispatchDesign }}>
      {children}
    </DesignContext.Provider>
  );
};

export const TextPropsContext = React.createContext<{
  props: IProps;
  dispatchProps: React.Dispatch<PropsAction>;
} | null>(null);

export const TextPropsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [props, dispatchProps] = React.useReducer(propsReducer, {
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
  });
  return (
    <TextPropsContext.Provider value={{ props, dispatchProps }}>
      {children}
    </TextPropsContext.Provider>
  );
};
