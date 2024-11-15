import * as React from "react";

import { useDispatch } from "react-redux";
import { ColorPickerContext } from "../context/colorpickercontext";
import { IsvgColor } from "@/@types/models";

export function ColorPicker(): React.ReactElement {
  const dispatchForCanvas = useDispatch();
  let { svgcolors, dispatchColorPicker } =
    React.useContext(ColorPickerContext)!;

  const setColor = (e: any, c: IsvgColor) => {
    //console.log(e.target.value);
    dispatchForCanvas({
      type: "UPDATE_SVG_COLOR",
      payload: {
        oldColor: c.value,
        newColor: e.target.value,
        colorIndex: c.id,
      },
    });
    c.value = e.target.value;
    svgcolors = svgcolors.map((thiscolor) => thiscolor.id == c.id ? {...thiscolor, value:e.target.value} : thiscolor);
    dispatchColorPicker({ type: "SVG_COLORS", payload: svgcolors });
  };
  return (
    <div className="border border-zinc-200">
      {svgcolors.length > 0 && (
        <div className="text-lg text-zinc-700 pt-10 ml-4">
          Svg Colors:
        </div>
      )}

      <div className="columns-3 gap-5 mt-3 p-2 flex mb-5">
        {svgcolors.map((c: IsvgColor) => {
          return (
            <input
              key={c.id}
              type="color"
              value={c.value}
              className="rounded"
              onChange={(e) => setColor(e, c)}
            />
          );
        })}
      </div>
    </div>
  );
}
