"use client";

import * as React from "react";
import {
  IsvgColor,
  ColorPickerAction,
} from "../@types/models";
import { colorPickerReducer} from "../reducer/colorpickerreducer";

export const ColorPickerContext = React.createContext<{
  svgcolors: IsvgColor[];
  dispatchColorPicker: React.Dispatch<ColorPickerAction>;
} | null>(null);


export const ColorPickerProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [svgcolors, dispatchColorPicker] = React.useReducer(colorPickerReducer,  []);

    return (
      <ColorPickerContext.Provider value={{ svgcolors, dispatchColorPicker }}>
        {children}
      </ColorPickerContext.Provider>
    );
  };

