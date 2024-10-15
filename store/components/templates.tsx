import { IDesign } from "@/@types/models";
import { DesignContext } from "../context/designcontext";
import * as React from "react";

export function Template() {
  const { designs, dispatchDesign } = React.useContext(DesignContext)!;
  const onDesignSelected = (e: any,design:IDesign) =>{
    dispatchDesign({type:"SWITCH_DESIGN", currentDesign:design})
  }
  return (
    <div className="mt-12">
      {designs
        .filter((d) => d.pngImage != null)
        .map((design) => (
            
          <img
            key={design.id}
            src={design.pngImage}
            className="cursor-pointer py-1 px-1 mb-1 border border-spacing-1 border-purple-200 hover:bg-zinc-200 hover:border-zinc-800"
            alt={design.apparel.side}
            width="60px"
            onClick={(e) => onDesignSelected(e,design)}
          />
         
        ))}
    </div>
  );
}
