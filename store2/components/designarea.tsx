"use client";

import { FaDownload, FaRedo, FaUndo } from "react-icons/fa";
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
import { useDispatch } from "react-redux";
import { ColorPickerContext } from "../context/colorpickercontext";
import { MenuContext } from "../context/menucontext";
import { useDownload } from "../shared/download";
import * as React from "react";
import { GetTextStyles } from "../shared/draw";  
import { useCart } from "@/context/cartContext"; 
import { UseCreateApparelDesign } from "@/app/hooks/useCreateApparealDesign";
import { useUploadImage } from "@/app/hooks/useUploadImage";
import { request } from "http"; 
import { useCreateApparelUpload } from "@/app/hooks/useApparelUpload";



const shapesGal = /(rect|circle|triangle)/i;
const clipartGal = /(group|path)/i;
const imageGal = /(image)/i;
const itextGal = /(i-text)/i;

export default function DesignArea(): React.ReactElement {     
 
  // const { mutate: createOrder, isLoading, isError } = useCreateOrder(); // Custom hook
// const {mutate:uploadImage , isError , isLoading} = useUploadImage()
  const {mutate:CreateApparelDesign , isLoading, isError} = UseCreateApparelDesign() 
  const { mutate: createApparelUpload} = useCreateApparelUpload();
  const {addToCart} = useCart()
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
  const [currentBgColor, setBgColor] = React.useState(design?.apparel.color);
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
    dispatchForCanvas({ type: "RESTORE_DESIGN", payload: design?.jsonDesign });
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
    dispatchDesign({
      type: "STORE_DESIGN",
      currentDesign: design,
      selectedApparal: apparel,
      jsonDesign: canvas?.toJSON(),
      pngImage: canvas?.toDataURL({ multiplier: 4 }),
      svgImage: canvas?.toSVG(),
    });
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

  const downloadPNG = (e: any) => {
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

  const downloadZip = (e: any) => {
    handleZip(designs);
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

  const clearDesignObject = () => {}; 

  // const vendorId = request.cookies.get("vendor_id"); 

  // const thumbnail = useUploadImage(design?.pngImage) 
  // const vendorIdFromCookie = Cookies.get('vendor_id') 
  // console.log("vendorIdFromCookie  " + vendorIdFromCookie)


  const addDesignToCart  = () => {
    if (!design?.pngImage) return; // Ensure there's an image to add
    console.log("my designs : ",designs)
    const newItem = {
      title: "product",
      thumbnail: design.pngImage,
      price : 100,
      color : design.apparel.color,
      id : nanoid(),
      quantity : 1,
      side : design.apparel.side,
      is_active : design.isactive, 
    };
    addToCart(newItem);
    console.log("Item added to cart:", newItem); 

 const ApparelDesigns = {
  design : {
    title : newItem.title,
    price : newItem.price,
    color : newItem.color,
    side : newItem.side,
    quantity : newItem.quantity,
  } ,
  thumbnail_images : newItem.thumbnail,
  is_active : newItem.is_active,
  archive : 'false',
  customer_id : sessionStorage.getItem('customerId'), 
  
 }  

 CreateApparelDesign(ApparelDesigns,
  {
    onSuccess: () => {
      console.log('data fatched confirmation ' , ApparelDesigns)
      
    },
    onError: (err) => {
      console.error("Error placing order:", err);
    },
 })  
 

 
 // Check if there's a valid upload URL
if (design.uploadedImages && design.uploadedImages.length > 0) {
  const ApparelUploadData = {
    url: design.uploadedImages[0], 
    apparelDesign_id: nanoid(),    
  };

  // Call the createApparelUpload API if a valid URL is present
  createApparelUpload(ApparelUploadData, {
    onSuccess: () => {
      console.log("Image uploaded successfully", ApparelUploadData);
    },
    onError: (err) => {
      console.error("Error uploading image:", err);
    },
  });
} else {
  console.log("No valid upload URL, skipping API call");
}






  







  };

  return (
    <div>
      <div className="flex justify-between  mb-1 ">
        <button
          type="button"
          onClick={(e) => {
            downloadDesignJson(e);
          }}
          className="text-purple-700 hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br  group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg  text-sm px-5 py-1.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white  dark:focus:ring-blue-800"
        >
          <IconContext.Provider
            value={{
              size: "18px",
              // color: "rgb(29,78,216)",
              className: "btn-download-design inline-block",
            }}
          >
            <FaDownload />
          </IconContext.Provider>
          <span className="ml-3">Download Json</span>
        </button>
        <button
          type="button"
          onClick={(e) => downloadZip(e)}
          className="text-purple-700 hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-blue-800"
        >
          <IconContext.Provider
            value={{
              size: "24px",
              // color: "rgb(29,78,216)",
              className: "btn-zip-design inline-block",
            }}
          >
            <VscBriefcase />
          </IconContext.Provider>
          <span className="ml-3">Download Zip</span>
        </button>
      </div>
      <div className="flex justify-between pt-2 bg-white p-2 pb-0 border border-b-0 border-zinc-300">
        <div>
          <div className="text-purple-700 float-left hover:text-white border-purple-700 hover:bg-purple-800  focus:ring-1 border group bg-gradient-to-br  group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg  text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white  dark:focus:ring-blue-800">
            <button onClick={(e) => downloadSVG(e)}>
              <IconContext.Provider
                value={{
                  size: "10px",
                  // color: "rgb(29,78,216)",
                  className: "btn-download-design inline-block",
                }}
              >
                <FaDownload />
              </IconContext.Provider>
              <p className="px-2 text-[10px]">SVG</p>
            </button>
          </div>
          <div className="text-purple-700 float-left hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br  group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg  text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white  dark:focus:ring-blue-800">
            <button onClick={(e) => downloadPNG(e)}>
              <IconContext.Provider
                value={{
                  size: "10px",
                  // color: "rgb(29,78,216)",
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
                  // color: "rgb(29,78,216)",
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
                  // color: "rgb(29,78,216)",
                  className: "btn-download-design inline-block",
                }}
              >
                <FaUndo />
              </IconContext.Provider>
              <p className="px-2 text-[10px]">Undo</p>
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
          <div className="columns-7 gap-4">
            {colors.map((color) => (
              <div
                key={color.value}
                className={`p-4 rounded-full cursor-pointer border hover:bg-zinc-800 hover:border-zinc-400 ${
                  color.selected ? "border border-zinc-500" : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorClick(color.value)}
              ></div>
            ))}
          </div>
        </div> 

        
        <div className="col-span-12 sm:col-span-12  md:col-span-12 lg:col-span-4 text-right"> 
          
      {/* Add to Cart Button  */}
       <button
        type="button"
        onClick={addDesignToCart }
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

          {/* <span className="text-purple-800">$24.92 AUD </span> &nbsp;
          <br /> */}
          {/* <button
            type="button"
            className="text-purple-700 hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border  focus:outline-none items-end focus:ring-blue-100 font-medium rounded-lg  text-sm px-5 py-1.5 text-center mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-blue-800"
          >
            <IconContext.Provider
              value={{
                size: "24px",
                // color: "rgb(29,78,216)",
                className: "btn-order-design inline-block",
              }}
            >
              <BiPurchaseTag />
            </IconContext.Provider>
            <span className="ml-3">Order Options</span>
          </button> */}
        </div> 


        
      </div>

     

     

      {/* Cart Items */}
      <div>
        <h3>Cart Items:</h3>
        {cart.map((item, index) => (
          <div key={index}>
            <p>{item.name}</p>
            <img src={item.image} alt={item.name} width="100" />
          </div>
        ))}
      </div>

     
    </div>
  );
}
