import React, { useContext } from 'react';
import { DesignContext } from "@/context/designcontext";
import { IDesign, IApparel } from "@/@types/models";

// Helper to restore design state
const restoreDesignState = (design: IDesign): IDesign => {
  if (!design) return {} as IDesign;
  
  return {
    ...design,
    items: design.items || [],
    jsonDesign: design.jsonDesign || null,
    pngImage: design.pngImage || null,
    svgImage: design.svgImage || null,
    uploadedImages: design.uploadedImages || [],
    // textProps: design.textProps || null,
    isactive: true // Ensure this design is marked as active
  };
};

// Custom hook for design switching
export const useDesignSwitcher = () => {
  const designContext = useContext(DesignContext);
  const { designs, dispatchDesign } = designContext || { designs: [], dispatchDesign: () => {} };

  const switchToDesign = async (design: IDesign) => {
    if (!dispatchDesign) return false;

    try {
      // First update the apparel color
      if (design.apparel?.color) {
        dispatchDesign({
          type: "UPDATE_APPAREL_COLOR",
          payload: design.apparel.color
        });
      }

      // Switch to the selected design first
      dispatchDesign({
        type: "UPDATE_DESIGN",
        payload: design.apparel
      });

      // If there's a stored design, restore it
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

      // Add any uploaded images
      if (design.uploadedImages && design.uploadedImages.length > 0) {
        design.uploadedImages.forEach(image => {
          dispatchDesign({
            type: "UPLOADED_IMAGE",
            payload: image
          });
        });
      }

      // Add any SVG items
      if (design.items && design.items.length > 0) {
        design.items.forEach(item => {
          dispatchDesign({
            type: "ADD_SVG",
            payload: item
          });
        });
      }

      // If there are text properties, restore them
      if (design.textProps) {
        dispatchDesign({
          type: "TEXT_PROPS",
          payload: design.textProps
        });
      }

      // Finally, switch to make this design active
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