import React, { useContext } from 'react';
import { DesignContext } from "@/context/designcontext";
import { IDesign, IApparel } from "@/@types/models";

const restoreDesignState = (design: IDesign): IDesign => {
  if (!design) return {} as IDesign;
  
  return {
    ...design,
    items: design.items || [],
    jsonDesign: design.jsonDesign || null,
    pngImage: design.pngImage || null,
    svgImage: design.svgImage || null,
    uploadedImages: design.uploadedImages || [],
    isactive: true 
  };
};

export const useDesignSwitcher = () => {
  const designContext = useContext(DesignContext);
  const { designs, dispatchDesign } = designContext || { designs: [], dispatchDesign: () => {} };

  const switchToDesign = async (design: IDesign) => {
    if (!dispatchDesign) return false;

    try {
      if (design.apparel?.color) {
        dispatchDesign({
          type: "UPDATE_APPAREL_COLOR",
          payload: design.apparel.color
        });
      }

      dispatchDesign({
        type: "UPDATE_DESIGN",
        payload: design.apparel
      });

      if (design.jsonDesign) {
        dispatchDesign({
          type: "STORE_DESIGN",
          currentDesign: design,
          jsonDesign: design.jsonDesign,
          pngImage: design.pngImage,
          svgImage: design.svgImage,
          selectedApparal: design.apparel
        });
      }

      if (design.uploadedImages && design.uploadedImages.length > 0) {
        design.uploadedImages.forEach(image => {
          dispatchDesign({
            type: "UPLOADED_IMAGE",
            payload: image
          });
        });
      }

      if (design.items && design.items.length > 0) {
        design.items.forEach(item => {
          dispatchDesign({
            type: "ADD_SVG",
            payload: item
          });
        });
      }

      if (design.textProps) {
        dispatchDesign({
          type: "TEXT_PROPS",
          payload: design.textProps
        });
      }

      dispatchDesign({
        type: "SWITCH_DESIGN",
        currentDesign: design
      });

      return true;
    } catch (error) {
      console.error("Error switching designs:", error);
      return false;
    }
  };

  return {
    switchToDesign,
    currentDesign: designs.find(d => d.isactive),
    designs
  };
};