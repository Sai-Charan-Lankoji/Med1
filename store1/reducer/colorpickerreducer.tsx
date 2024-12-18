import { IsvgColor, ColorPickerAction } from "../@types/models";

export const colorPickerReducer = (
  colors: IsvgColor[],
  action: ColorPickerAction
): IsvgColor[] => {
 
  switch (action.type) {
    case "SVG_COLORS":
      return action.payload;
    case "UPDATE_DESING_COLOR":
      colors = action.payload.colors;
      return action.payload.colors;

    default:
      return colors;
  }
};
