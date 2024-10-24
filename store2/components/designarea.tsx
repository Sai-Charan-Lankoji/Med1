"use client";

import React, { useEffect , useState} from 'react'; 

import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { fabric } from "fabric";
import { useDispatch } from "react-redux";
import { FaDownload, FaRedo, FaUndo, FaSync } from "react-icons/fa";
import { VscBriefcase } from "react-icons/vsc";
import { FiShoppingBag } from "react-icons/fi";
import { IconContext } from "react-icons/lib";

import { DesignContext, TextPropsContext } from "../context/designcontext";
import { ColorPickerContext } from "../context/colorpickercontext";
import { MenuContext } from "../context/menucontext";
import { useUserContext } from "../context/userContext";
import { useSvgContext } from '@/context/svgcontext';
import { useCart } from "@/context/cartContext";
import { useDownload } from "../shared/download";
import { GetTextStyles } from "../shared/draw";
import { UseCreateApparelDesign } from "@/app/hooks/useCreateApparealDesign";
import { useCreateApparelUpload } from "@/app/hooks/useApparelUpload";

import {
  extractFillColorsSelectedObject,
} from "@/shared/controlutils";
import {
  IBgcolor,
  bgColours,
  designApparels,
  IApparel,
} from "../@types/models"; 

import imageCompression from 'browser-image-compression';


const shapesGal = /(rect|circle|triangle)/i;
const clipartGal = /(group|path)/i;
const imageGal = /(image)/i;
const itextGal = /(i-text)/i;

export default function DesignArea(): React.ReactElement {   
  const {svgUrl} = useSvgContext();
  const router = useRouter();
  const { customerToken } = useUserContext();
  const dispatchForCanvas = useDispatch();
  const [downloadStatus, setDownloadStatus] = React.useState("");
  const { svgcolors, dispatchColorPicker } = React.useContext(ColorPickerContext)!;
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;
  const { designs, dispatchDesign } = React.useContext(DesignContext)!;
  const design = designs.find((d) => d.isactive === true);
  const { handleZip } = useDownload();
  const { props, dispatchProps } = React.useContext(TextPropsContext)!;

  const [canvas, setCanvas] = React.useState<fabric.Canvas | null>(null);
  const [currentBgColor, setBgColor] = useState(design?.apparel.color);
  const [apparels, setApparels] = useState<IApparel[]>(designApparels);
  const [colors, setColors] = useState<IBgcolor[]>(bgColours);
  const { cart, addToCart, setCart } = useCart();

  const {
    mutate: CreateApparelDesign,
    isLoading,
    isError,
  } = UseCreateApparelDesign();
  const { mutate: createApparelUpload } = useCreateApparelUpload(); 
  const [isStateRestored, setIsStateRestored] = useState(false);


  useEffect(() => {
    const savedState = localStorage.getItem('designState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setCart(parsedState.cart);
      setBgColor(parsedState.currentBgColor);
      setApparels(parsedState.apparels);
      setColors(parsedState.colors);
      
      // Added: Restore the design state
      if (parsedState.design) {
        dispatchDesign({
          type: "STORE_DESIGN",
          currentDesign: parsedState.design,
          selectedApparal: parsedState.design.apparel,
          jsonDesign: parsedState.canvasJSON,
          pngImage: parsedState.design.pngImage,
          svgImage: parsedState.design.svgImage,
        });
      }
    }
  }, []);


  useEffect(() => {
    // Changed: Get canvas element directly
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvasElement) return;

    // Changed: Create canvas using the DOM element
    const newCanvas = new fabric.Canvas(canvasElement, {
      height: design?.apparel.height,
      width: design?.apparel.width,
    });
    setCanvas(newCanvas);
    dispatchForCanvas({ type: "INIT", canvas: newCanvas });

    // Modified: Check for saved canvas state and restore if available
    const savedState = localStorage.getItem('designState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState.canvasJSON) {
        newCanvas.loadFromJSON(parsedState.canvasJSON, () => {
          newCanvas.renderAll();
          setIsStateRestored(true);
        });
      }
    } else {
      dispatchForCanvas({ type: "RESTORE_DESIGN", payload: design?.jsonDesign });
    }

    const handleNewImage = (event: CustomEvent) => {
      const imageUrl = event.detail.imageUrl;
      handleImagePlacement(imageUrl);
    };
    window.addEventListener("newImageUploaded", handleNewImage as EventListener);

    return () => {
      newCanvas.dispose();
      window.removeEventListener("newImageUploaded", handleNewImage as EventListener);
    };
  }, [design]);

  // Added: New useEffect to remove localStorage data after state is restored
  useEffect(() => {
    if (isStateRestored && canvas) {
      localStorage.removeItem('designState');
      setIsStateRestored(false);
    }
  }, [isStateRestored, canvas]);

  const saveStateToLocalStorage = () => {
    const stateToSave = {
      cart: cart,
      currentBgColor: currentBgColor,
      apparels: apparels,
      colors: colors,
      canvasJSON: canvas?.toJSON(),
      design: design,
    };
    localStorage.setItem('designState', JSON.stringify(stateToSave));
  };

  const handleImagePlacement = (imageUrl: string) => {
    if (canvas) {
      fabric.Image.fromURL(imageUrl, (img) => {
        img.scaleToWidth(200); 
        canvas.add(img);
        canvas.renderAll();
      });
    }
  };  


  useEffect(() => {
    if (!canvas) return;
    canvas.on("selection:created", function (options) {
      if (options.e) {
        options.e.preventDefault();
        options.e.stopPropagation();
      }
      let selectionCreated = options.selected;
      if (selectionCreated && selectionCreated.length > 0) {
        if (selectionCreated[0].type?.match(clipartGal)) {
          let colors = extractFillColorsSelectedObject(canvas.getActiveObject());
          dispatchColorPicker({ type: "SVG_COLORS", payload: colors });
        }
      }
    });
  }, [canvas]);




  // canvas?.on("selection:created", function (options) {
  //   if (options.e) {
  //     options.e.preventDefault();
  //     options.e.stopPropagation();
  //   }
  //   let selectionCreated = options.selected;
  //   if (selectionCreated && selectionCreated.length > 0) {
  //     if (selectionCreated[0].type?.match(clipartGal)) {
  //       let colors = extractFillColorsSelectedObject(canvas.getActiveObject());
  //       dispatchColorPicker({ type: "SVG_COLORS", payload: colors });
  //     }
  //   }
  // });

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

  const handleImageClick = (e: React.MouseEvent, apparel: IApparel) => {
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

  const downloadDesignJson = () => {
    const json = JSON.stringify(designs);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "design.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadStatus("Downloaded");
  };

  const downloadSVG = () => {
    const svgImage = canvas?.toSVG() ?? "";
    const blob = new Blob([svgImage], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${design?.apparel.side ?? "design"}.svg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPNG = () => {
    const pngImage = canvas?.toDataURL({ multiplier: 4 }) ?? "";
    const link = document.createElement("a");
    link.href = pngImage;
    link.setAttribute("download", `${design?.apparel.side ?? "design"}.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadZip = () => {
    handleZip(designs);
  };

  const undo = () => {
    dispatchForCanvas({ type: "UNDO" });
  };

  const redo = () => {
    dispatchForCanvas({ type: "REDO" });
  };

  const reset = () => {
    dispatchForCanvas({ type: "RESET" });
  };

  const switchMenu = (type: string, object: fabric.Object | undefined) => {
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
  
  







  
  const addDesignToCart = async () => {  


    




    if (!customerToken) {
      saveStateToLocalStorage();  
      router.push("/auth");
    } else {
      if (!design?.pngImage) return;

      const canvasItems = canvas?.getObjects() || [];
      console.log("this are the canvas items" , canvasItems)
      const cliparts = canvasItems.filter(item => item.type === 'group' || item.type === 'path');
      const uploadedImages = canvasItems.filter(item => item.type === 'image');

      const newItem = {
        title: "Custom T-Shirt Design",
        thumbnail: design?.pngImage,
        upload: design?.uploadedImages?.[0],
        price: 100,
        color: currentBgColor,
        id: nanoid(),
        quantity: 1,
        side: design.apparel.side,
        is_active: design.isactive,
        backgroundTShirt: {
          url: design.apparel.url,
          color: currentBgColor,
        },
        // cliparts: cliparts.map(clipart => ({
        //   type: clipart.type,
        //   src: (clipart as fabric.Object).toDataURL(),
        // })),
        // uploadedImages: uploadedImages.map(img => ({
        //   src: (img as fabric.Image).toDataURL() ,
        // })),
        svgUrl: svgUrl, 
      }; 

      console.log("this is new Item : " ,newItem)

      addToCart(newItem);

      const ApparelDesigns = {
        design: {
          title: newItem.title,
          price: newItem.price,
          color: newItem.color,
          side: newItem.side,
          quantity: newItem.quantity,
          backgroundTShirt: newItem.backgroundTShirt,
        },
        thumbnail_images: design.uploadedImages?.[0] || svgUrl,
        is_active: newItem.is_active,
        archive: "false",
        customer_id: sessionStorage.getItem("customerId"),
      };

      CreateApparelDesign(ApparelDesigns, {
        onSuccess: (response) => {
          console.log("Created apparel design data ", response);
          const apparelDesignId = response.newDesign.id;

          const ApparelUploadData = {
            url: design.uploadedImages?.[0],
            apparelDesign_id: apparelDesignId,
          }; 

          if(ApparelUploadData.url){
            createApparelUpload(ApparelUploadData, {
              onSuccess: (response) => {
                console.log("Uploaded apparel design image data:", response);
              },
              onError: (err) => {
                console.error("Error uploading apparel design image:", err);
              },
            });
          }

         
        },
        onError: (err) => {
          console.error("Error creating apparel design:", err);
        },
      });
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
          <IconContext.Provider value={{ size: "18px", className: "btn-download-design inline-block" }}>
            <FaDownload />
          </IconContext.Provider>
          <span className="ml-3">Download Json</span>
        </button>
        <button
          type="button"
          
          onClick={downloadZip}
          className="text-purple-700 hover:text-white border-purple-700  hover:bg-purple-800 focus:ring-1 border focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-blue-800"
        >
          <IconContext.Provider value={{ size: "24px", className: "btn-zip-design inline-block" }}>
            <VscBriefcase />
          </IconContext.Provider>
          <span className="ml-3">Download Zip</span>
        </button>
      </div>

      <div className="flex justify-between pt-2 bg-white p-2 pb-0 border border-b-0 border-zinc-300">
        <div>
          <div className="text-purple-700 float-left hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:focus:ring-blue-800">
            <button onClick={downloadSVG}>
              <IconContext.Provider value={{ size: "10px", className: "btn-download-design inline-block" }}>
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
            <button onClick={() => redo()}>
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
            <button onClick={() => undo()}>
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
          <button
            type="button"
            onClick={addDesignToCart}
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