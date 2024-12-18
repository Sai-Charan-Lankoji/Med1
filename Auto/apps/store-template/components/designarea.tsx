
"use client";

import { FaDownload, FaRedo, FaSync, FaUndo } from "react-icons/fa";
import { VscBriefcase } from "react-icons/vsc";
import { IconContext } from "react-icons/lib";
import { fabric } from "fabric";
import { DesignContext, TextPropsContext } from "../context/designcontext"; 
import { FiShoppingBag } from "react-icons/fi";
import {
  initControls,
  extractFillColorsSelectedObject,
} from "@/shared/controlutils";
import {
  IBgcolor,
  bgColours,
  designApparels,
  IApparel,
} from "../@types/models";
import { useDispatch, useSelector } from "react-redux";
import { ColorPickerContext } from "../context/colorpickercontext";
import { MenuContext } from "../context/menucontext";
import { useDownload } from "../shared/download";
import * as React from "react";
import { GetTextStyles } from "../shared/draw";  
import { UseCreateApparelDesign } from "@/app/hooks/useCreateApparealDesign";
import { useCreateApparelUpload } from "@/app/hooks/useApparelUpload";
import { useUserContext } from "../context/userContext"; 
import { useRouter } from "next/navigation";
import {useSvgContext} from "../context/svgcontext" 
import { useNewCart } from "@/app/hooks/useNewCart";
import { useEffect, useState } from "react"; 
import { NEXT_PUBLIC_VENDOR_ID, NEXT_PUBLIC_STORE_ID } from "@/constants/constants";


const shapesGal = /(rect|circle|triangle)/i;
const clipartGal = /(group|path)/i;
const imageGal = /(image)/i;
const itextGal = /(i-text)/i;

export default function DesignArea({ isVendorMode = false }: { isVendorMode?: boolean }): React.ReactElement {      
  interface RootState {
    setReducer: {
      canvas: fabric.Canvas | undefined;
      color: string;
      undoStack: any[];
      redoStack: any[];
      pauseSaving: boolean;
      initialState: any;
    };
  }
  
  // Get canvas state with proper type checking
  const canvasState = useSelector((state: RootState) => state.setReducer);
  const { addDesignToCart, loading: cartLoading } = useNewCart()
  const { updateCart } = useNewCart() 
  const { customerToken } = useUserContext(); 
  const isAuthorized = isVendorMode || customerToken;
  const router = useRouter(); 
  const {svgUrl} = useSvgContext()
  const {mutate:CreateApparelDesign , isLoading, isError} = UseCreateApparelDesign() 
  const { mutate: createApparelUpload} = useCreateApparelUpload();
  const dispatchForCanvas = useDispatch();
  const [downloadStatus, setDownloadStatus] = React.useState("");
  const { svgcolors, dispatchColorPicker } = React.useContext(ColorPickerContext)!;
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;
  const { designs, dispatchDesign, currentBgColor, updateColor } = React.useContext(DesignContext)!;
  const design = designs.find((d) => d.isactive === true);
  const { handleZip } = useDownload();
  const { props, dispatchProps } = React.useContext(TextPropsContext)!;
  const [canvas, setCanvas] = React.useState<fabric.Canvas>();
  const [apparels, setApparels] = React.useState<IApparel[]>(designApparels);
  let selectionCreated: fabric.Object[] | undefined;
  const [cart, setCart] = React.useState<{ name: string; image: string }[]>([]);
  const [cartId, setCartId] = useState<any>();
  const [colors, setColors] = React.useState<IBgcolor[]>(
    bgColours.map(color => ({
      ...color,
      selected: color.value === currentBgColor
    }))
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCartId(localStorage.getItem("cart_id"));
    } 

  }, []);
  canvas?.on("selection:created", function (options) {
    if (options.e) {
      options.e.preventDefault();
      options.e.stopPropagation();
    }
    selectionCreated = options.selected;
    if (selectionCreated && selectionCreated.length > 0) {
      if (selectionCreated[0].type?.match(clipartGal)) {
        let colors = extractFillColorsSelectedObject(canvas.getActiveObject());
        dispatchColorPicker({ type: "SVG_COLORS", payload: colors });
      }
    }
  }); 

  canvas?.on("selection:updated", function (options) {
     if (options.e) {
      options.e.preventDefault();
      options.e.stopPropagation();
    }
    selectionCreated = options.selected;
    if (selectionCreated && selectionCreated.length > 0) {
      if (selectionCreated[0].type == "group") {
        let colors = extractFillColorsSelectedObject(canvas.getActiveObject());
        dispatchColorPicker({ type: "SVG_COLORS", payload: colors });
      }
    }
  });
  canvas?.on("selection:cleared", function (options) {
    let deselectedObj = options.deselected;
    if (deselectedObj && deselectedObj.length > 0) {
      if (deselectedObj[0].type == "group") {
        dispatchColorPicker({ type: "SVG_COLORS", payload: [] });
      }
    }
  });
  canvas?.on("object:removed", function (options) {
    
    dispatchColorPicker({ type: "SVG_COLORS", payload: [] });
  });

  canvas?.on("mouse:up", function (options) {
     switchMenu(options.target?.type, options.target);
  });

  canvas?.on("object:moving", (e) => {
    dispatchForCanvas({ type: "UPDATE_CANVAS_ACTIONS" });
  });
  canvas?.on("object:scaling", (e) => {
    dispatchForCanvas({ type: "UPDATE_CANVAS_ACTIONS" });
  });
  canvas?.on("object:rotating", (e) => {
    dispatchForCanvas({ type: "UPDATE_CANVAS_ACTIONS" });
  });

  initControls();
  React.useEffect(() => {
    let canvas = new fabric.Canvas("canvas", {
      height: design?.apparel.height,
      width: design?.apparel.width,
    });
    setCanvas(canvas);
    dispatchForCanvas({ type: "INIT", canvas: canvas });
    if (design?.jsonDesign) {
      dispatchForCanvas({ 
        type: "RESTORE_DESIGN", 
        payload: design.jsonDesign 
      });
    }
    return () => {
      canvas.dispose();
    };
  }, [design]);

  const getCanvasClass = () => {

    if (design?.apparel.url === designApparels[0].url) {
      
      return "canvas-style1";
    } else if (design?.apparel.url === designApparels[1].url) {
      return "canvas-style2";
    } else if (design?.apparel.url === designApparels[2].url) {
      return "canvas-style3";
    } else if (design?.apparel.url === designApparels[3].url) {
      return "canvas-style4";
    } 

   
    return "";
  };

  const handleImageClick = (e: any, apparel: IApparel) => {
    e.preventDefault();
    setApparels(
      apparels.map((product) =>
        product.url === apparel.url
          ? { ...product, selected: true }
          : { ...product, selected: false }
      )
    );
    dispatchColorPicker({ type: "SVG_COLORS", payload: [] });
  
    if (design) {
      dispatchDesign({
        type: "STORE_DESIGN",
        currentDesign: design,
        selectedApparal:  { ...apparel, color: currentBgColor },
        jsonDesign: canvas?.toJSON(),
        pngImage: canvas?.toJSON().objects.length ? canvas?.toDataURL({ multiplier: 4 }) : null,
        svgImage: canvas?.toSVG(),
      });
    } else {
      console.error("Design is undefined");
    }
  
    dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: currentBgColor });
  };

  const handleColorClick = (value: string) => {
    setColors(
      colors.map((color) =>
        color.value === value
          ? { ...color, selected: true }
          : { ...color, selected: false }
      )
    );
    updateColor(value);
    //dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: value });
  };
   const downloadDesignJson = (e: any) => {
    const json = JSON.stringify(designs);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // Setting filename received in response
    link.setAttribute("download", "design");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadStatus("Downloaded");
  };

  const downloadSVG = (e: any) => {
    const svgImage = canvas?.toSVG() ?? "";
    const blob = new Blob([svgImage], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Setting filename received in response
    link.setAttribute("download", design?.apparel.side ?? "design");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPNG = () => {
    const pngImage =
      canvas?.toDataURL({
        multiplier: 4,
      }) ?? "";
    const link = document.createElement("a");
    link.href = pngImage;

    // Setting filename received in response
    link.setAttribute("download", design?.apparel.side ?? "design" + ".png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadZip = () => {
    handleZip(designs);
  };


  const reset = () => {
    dispatchDesign({ type: "CLEAR_ALL" });
    localStorage.removeItem('savedDesignState');
    localStorage.removeItem('savedPropsState');
    localStorage.removeItem('cart_id')
  router.refresh();
  };

  const undo = (e: any) => {
    dispatchForCanvas({ type: "UNDO" });
  };

  const redo = (e: any) => {
    dispatchForCanvas({ type: "REDO" });
  };

  const switchMenu = (type: any, object: fabric.Object | undefined) => {
    if (!type) return;
    if (type.match(clipartGal)) {
      dispatchMenu({ type: "SWITCH_TO_CLIPART", payload: true });
    } else if (type.match(shapesGal)) {
      dispatchMenu({ type: "SWITCH_TO_SHAPE", payload: true });
    } else if (type.match(imageGal)) {
      dispatchMenu({ type: "SWITCH_TO_UPLOAD_IMAGE", payload: true });
    } else if (type.match(itextGal)) {
      const textProps = GetTextStyles(object);
      dispatchMenu({ type: "SWITCH_TO_TEXT", payload: true, props: textProps });
      dispatchProps({ type: "SELECTED_PROPS", payload: textProps });
    }
  }; 

  const saveStateToLocalStorage = () => {
    const stateToSave = {
      cart: cart,
      currentBgColor: currentBgColor,
      apparels: apparels,
      colors: colors,
      canvasJSON: canvas?.toJSON(),
      design: design,
    };
    localStorage.setItem("designState", JSON.stringify(stateToSave));
  };

  const clearDesignObject = () => {};   

  const handleUpdateCart = async () => {
  
    const currentDesignState = designs.map(design => ({
      ...design,
      svgImage: design.id === design?.id ? svgUrl : design.svgImage // Update SVG for current design 
     
    }), 
    
  );
    // Get the current text props state for saving
    const currentPropsState = {
      ...props,
      designId: design?.id // Ensure we associate props with current design
    };
    if (!customerToken) {
      saveStateToLocalStorage();
      router.push("/auth");
      return;
    }

    const success = await updateCart(
      cartId,
      currentDesignState,
      currentPropsState,
      designs
    );
    
    if (success) {
      dispatchDesign({ type: "CLEAR_ALL" });
      localStorage.removeItem('savedDesignState');
      localStorage.removeItem('savedPropsState');
      router.refresh();
    
    }
  }



  const addProduct = async () => {
    try {
      const currentDesignState = designs.map(design => ({
        ...design,
        svgImage: design.id === design?.id ? svgUrl : design.svgImage
      }));
    
      // Get the current text props state for saving
      const currentPropsState = {
        ...props,
        designId: design?.id
      };
      // Prepare the request body
      const requestBody = {
        vendor_id: NEXT_PUBLIC_VENDOR_ID,
        store_id: NEXT_PUBLIC_STORE_ID,
        designs:designs,
        designstate:currentDesignState,
        propstate: currentPropsState,
        customizable: true
      };
  
      // Make the API call
      const response = await fetch('https://med1-wyou.onrender.com/store/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      const data = await response.json();
      // Clear the design state after successful product creation
      dispatchDesign({ type: "CLEAR_ALL" });
      localStorage.removeItem('savedDesignState');
      localStorage.removeItem('savedPropsState');
      
      // Refresh the page or show success message
      router.refresh();
      
      return data;
  
    } catch (error) {
      console.error('Error creating product:', error);
      // Handle error appropriately - maybe show a toast or alert
      throw error;
    }
  };

  const handleAddToCart = async () => {
    // Get the current design state for saving
    const currentDesignState = designs.map(design => ({
      ...design,
      svgImage: design.id === design?.id ? svgUrl : design.svgImage
    }));
  
    // Get the current text props state for saving
    const currentPropsState = {
      ...props,
      designId: design?.id
    };
  
    // If user is not logged in, save states and redirect
    if (!customerToken) {
      // Save design states to localStorage
      localStorage.setItem('pendingCartAdd', 'true');
      localStorage.setItem('pendingDesignState', JSON.stringify(currentDesignState));
      localStorage.setItem('pendingPropsState', JSON.stringify(currentPropsState));
      saveStateToLocalStorage();
      router.push("/auth");
      return;
    }
    
    const success = await addDesignToCart(
      designs,
      customerToken,
      svgUrl,
      currentDesignState,
      currentPropsState,
    );
    
    if (success) {
      dispatchDesign({ type: "CLEAR_ALL" });
      localStorage.removeItem('savedDesignState');
      localStorage.removeItem('savedPropsState');
      localStorage.removeItem('pendingCartAdd');
      localStorage.removeItem('pendingDesignState');
      localStorage.removeItem('pendingPropsState');
      updateColor("#fff");
      dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: "#fff" });
    }
  };
  
  // Add this effect in your component
  useEffect(() => {
    const checkPendingCartAdd = async () => {
      const hasPendingAdd = localStorage.getItem('pendingCartAdd');
      
      // Check if there's a pending cart addition after login
      if (customerToken && hasPendingAdd === 'true') {
        const pendingDesignStateStr = localStorage.getItem('pendingDesignState');
        const pendingPropsStateStr = localStorage.getItem('pendingPropsState');
        
        if (!pendingDesignStateStr || !pendingPropsStateStr) {
          return; // Exit if either state is missing
        }
  
        try {
          const pendingDesignState = JSON.parse(pendingDesignStateStr);
          const pendingPropsState = JSON.parse(pendingPropsStateStr);
          
          const success = await addDesignToCart(
            pendingDesignState,
            customerToken,
            svgUrl,
            pendingDesignState,
            pendingPropsState
          );
          
          if (success) {
            dispatchDesign({ type: "CLEAR_ALL" });
            localStorage.removeItem('savedDesignState');
            localStorage.removeItem('savedPropsState');
            localStorage.removeItem('pendingCartAdd');
            localStorage.removeItem('pendingDesignState');
            localStorage.removeItem('pendingPropsState');
            updateColor("#fff");
            dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: "#fff" });
          }
        } catch (error) {
          console.error('Error processing pending cart addition:', error);
          // Clean up invalid stored data
          localStorage.removeItem('pendingCartAdd');
          localStorage.removeItem('pendingDesignState');
          localStorage.removeItem('pendingPropsState');
        }
      }
    };
  
    checkPendingCartAdd();
  }, [customerToken]); 



 


  

  return (
    <div>
      <div className="flex justify-between mb-1">
        {(isVendorMode || customerToken) && (
          <>
        <button
          type="button"
          onClick={downloadDesignJson}
          className="text-purple-700 hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:focus:ring-blue-800"
        >
          <IconContext.Provider
            value={{
              size: "18px",
              className: "btn-download-design inline-block",
            }}
          >
            <FaDownload />
          </IconContext.Provider>
          <span className="ml-3">Download Json</span>
        </button>
        <button
          type="button"
          onClick={downloadZip}
          className="text-purple-700 hover:text-white border-purple-700  hover:bg-purple-800 focus:ring-1 border focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-blue-800"
        >
          <IconContext.Provider
            value={{ size: "24px", className: "btn-zip-design inline-block" }}
          >
            <VscBriefcase />
          </IconContext.Provider>
          <span className="ml-3">Download Zip</span>
        </button>
        </>
        )}
      </div>

      <div className="flex justify-between pt-2 bg-white p-2 pb-0 border border-b-0 border-zinc-300">
        <div>
        {(isVendorMode || customerToken) && (
          <>
          <div className="text-purple-700 float-left hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:focus:ring-blue-800">
          
            <button onClick={downloadSVG}>
              <IconContext.Provider
                value={{
                  size: "10px",
                  className: "btn-download-design inline-block",
                }}
              >
                <FaDownload />
              </IconContext.Provider>
              <p className="px-2 text-[10px]">SVG</p>
            </button>
          </div>
          <div className="text-purple-700 float-left hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br  group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg  text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white  dark:focus:ring-blue-800">
            <button onClick={() => downloadPNG()}>
              <IconContext.Provider
                value={{
                  size: "10px",
                  className: "btn-download-design inline-block",
                }}
              >
                <FaDownload />
              </IconContext.Provider>
              <p className="px-2 text-[10px]">PNG</p>
            </button>
          </div>
          </>
        )}
        </div>

        <div>
          <div className="text-purple-700 float-right hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br  group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg  text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white  dark:focus:ring-blue-800">
            <button onClick={(e) => redo(e)}>
              <IconContext.Provider
                value={{
                  size: "10px",
                  className: "btn-download-design inline-block",
                }}
              >
                <FaRedo />
              </IconContext.Provider>
              <p className="px-2 text-[10px]">Redo</p>
            </button>
          </div>
          <div className="text-purple-700 float-right hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br  group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg  text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white  dark:focus:ring-blue-800">
            <button onClick={(e) => undo(e)}>
              <IconContext.Provider
                value={{
                  size: "10px",
                  className: "btn-download-design inline-block",
                }}
              >
                <FaUndo />
              </IconContext.Provider>
              <p className="px-2 text-[10px]">Undo</p>
            </button>
          </div>
          <div className="text-purple-700 float-right hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br  group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg  text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white  dark:focus:ring-blue-800">
            <button onClick={() => reset()}>
              <IconContext.Provider
                value={{
                  size: "10px",
                  className: "btn-download-design inline-block",
                }}
              >
                <FaSync />
              </IconContext.Provider>
              <p className="px-2 text-[10px]">Reset</p>
            </button>
          </div>
        </div>
      </div>

      <div className="canvas_section relative bg-white text-center border border-t-0 border-zinc-300">
        <div className={`inline-block p-2 `}>
          <img
            src={design?.apparel.url}
            className="img-fluid inline w-3/4"
            alt="Current Background"
            style={{ backgroundColor: currentBgColor }}
          />
          <div
            className={`canvas_div none text-gray-400 border-1 top-20 absolute border-stone-600 ${getCanvasClass()}`}
          >
            <canvas id="canvas"></canvas>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-3 items-center">
        <div className="col-span-12 sm:col-span-12  md:col-span-6 lg:col-span-4">
          <div className="columns-4 gap-5">
            {apparels.map((apparel) => (
              <div
                key={apparel.url}
                className={`w-full p-1 rounded-lg border hover:bg-zinc-200 hover:border-zinc-400 ${
                  apparel.selected ? "border border-zinc-500" : ""
                }`}
              >
                <img
                  src={apparel.url}
                  className="w-full cursor-pointer"
                  onClick={(e) => handleImageClick(e, apparel)}
                  alt="Product"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-12  md:col-span-6 lg:col-span-4">
          <p className="text-purple-800">Color:</p>
          <div className="columns-5 sm:gap-3 md:gap-5">
            {colors.map((color) => (
              <div
                key={color.value}
                className={`sm:p-4 sm:w-4 sm:h-4 md:p-3 lg:p-[12px] sm:rounded-full cursor-pointer border hover:bg-zinc-800 hover:border-zinc-400 ${
                  color.selected ? "border border-zinc-500" : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorClick(color.value)}
              ></div>
            ))}
          </div>
        </div>

        <div className="col-span-12 sm:col-span-12  md:col-span-12 lg:col-span-4 text-right">
          <button
            type="button"
            onClick={() => isVendorMode? addProduct() :(cartId? handleUpdateCart() : handleAddToCart()) }
            className="text-purple-700 hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-blue-800"
          >
            <IconContext.Provider
              value={{
                size: "24px",
                className: "btn-add-to-cart inline-block",
              }}
            >
              <FiShoppingBag />
            </IconContext.Provider>
            <span className="ml-3">{isVendorMode? "Add Product" : (cartId ? `Update Cart` : `Add to Cart`)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
