
"use client";

import { FaDownload, FaRedo, FaSync, FaUndo } from "react-icons/fa";
import { VscBriefcase } from "react-icons/vsc";
import { BiPurchaseTag } from "react-icons/bi";
import { IconContext } from "react-icons/lib";
// import { v4 as uuidv4 } from 'uuid'; 
import {nanoid} from 'nanoid'
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
//import { useCart } from "@/context/cartContext"; 
import { UseCreateApparelDesign } from "@/app/hooks/useCreateApparealDesign";
//import { useUploadImage } from "@/app/hooks/useUploadImage";
import { request } from "http"; 
import { useCreateApparelUpload } from "@/app/hooks/useApparelUpload";
import { useUserContext } from "../context/userContext"; 
import { useRouter } from "next/navigation";
import { compressBase64Image } from "@/app/utils/imageCompression"; 
import {useSvgContext} from "../context/svgcontext" 

import { useNewCart } from "@/app/hooks/useNewCart";




const shapesGal = /(rect|circle|triangle)/i;
const clipartGal = /(group|path)/i;
const imageGal = /(image)/i;
const itextGal = /(i-text)/i;

export default function DesignArea(): React.ReactElement {       
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

  const { customerToken } = useUserContext(); 
  const router = useRouter(); 
  const {svgUrl} = useSvgContext()
 console.log("SVG URL: ",svgUrl)
  // const { mutate: createOrder, isLoading, isError } = useCreateOrder(); // Custom hook
// const {mutate:uploadImage , isError , isLoading} = useUploadImage()
  const {mutate:CreateApparelDesign , isLoading, isError} = UseCreateApparelDesign() 
  const { mutate: createApparelUpload} = useCreateApparelUpload();
  //const {addToCart} = useCart()
  const dispatchForCanvas = useDispatch();
  const [downloadStatus, setDownloadStatus] = React.useState("");
  const { svgcolors, dispatchColorPicker } =
    React.useContext(ColorPickerContext)!;
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;
  const { designs, dispatchDesign } = React.useContext(DesignContext)!;
  const design = designs.find((d) => d.isactive === true);
  const { handleZip } = useDownload();
  const { props, dispatchProps } = React.useContext(TextPropsContext)!;

  const [canvas, setCanvas] = React.useState<fabric.Canvas>();
  const [currentBgColor, setBgColor] = React.useState('');
  const [apparels, setApparels] = React.useState<IApparel[]>(designApparels);
  const [colors, setColors] = React.useState<IBgcolor[]>(bgColours);
  let selectionCreated: fabric.Object[] | undefined;
  const [cart, setCart] = React.useState<{ name: string; image: string }[]>([]);

  canvas?.on("selection:created", function (options) {
    //console.log(options);
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


  // canvas?.on("object:modified", () => {
  //   dispatchForCanvas({ type: "UPDATE_CANVAS_ACTIONS" });
  // });

  // canvas?.on("object:added", () => {
  //   dispatchForCanvas({ type: "UPDATE_CANVAS_ACTIONS" });
  // });

  canvas?.on("selection:updated", function (options) {
    //console.log(options);
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
    console.log(options);
    console.log(options.target?.type);
    dispatchColorPicker({ type: "SVG_COLORS", payload: [] });
  });

  canvas?.on("mouse:up", function (options) {
    console.log(options.target?.type);
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
        selectedApparal: apparel,
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
    setBgColor(value);
    dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: value });
  };
  console.log("Json Design:", designs)
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

  const handleAddToCart = async () => {
    // Get the current design state for saving
    const currentDesignState = designs.map(design => ({
      ...design,
      svgImage: design.id === design?.id ? svgUrl : design.svgImage // Update SVG for current design
    }));
  
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
    
    const success = await addDesignToCart(
      designs, // Current designs being added to cart
      customerToken, 
      svgUrl,
      currentDesignState, // Full design state for saving
      currentPropsState  // Full props state for saving
    );
    
    console.log("Success", success);
    if (success) {
      dispatchDesign({ type: "CLEAR_ALL" });
      localStorage.removeItem('savedDesignState');
      localStorage.removeItem('savedPropsState');
    }
  };

  

  return (
    <div>
      <div className="flex justify-between mb-1">
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
      </div>

      <div className="flex justify-between pt-2 bg-white p-2 pb-0 border border-b-0 border-zinc-300">
        <div>
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
            onClick={handleAddToCart}
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
            <span className="ml-3">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
