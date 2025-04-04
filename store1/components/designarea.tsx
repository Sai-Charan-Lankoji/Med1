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
  IDesign,
  IProps,
} from "../@types/models";
import { useDispatch, useSelector } from "react-redux";
import { ColorPickerContext } from "../context/colorpickercontext";
import { MenuContext } from "../context/menucontext";
import { useDownload } from "../shared/download";
import * as React from "react";
import { GetTextStyles } from "../shared/draw";
import { useUserContext } from "../context/userContext";
import { useRouter } from "next/navigation";
import { useSvgContext } from "../context/svgcontext";
import { useNewCart } from "@/app/hooks/useNewCart";
import { useEffect, useState } from "react";
import { getStackFromDB } from "@/utils/indexedDButils";
import { useStore } from "@/context/storecontext";
import { NEXT_PUBLIC_API_URL } from "@/constants/constants";

const shapesGal = /(rect|circle|triangle)/i;
const clipartGal = /(group|path)/i;
const imageGal = /(image)/i;
const itextGal = /(i-text)/i;

export default function DesignArea({
  isVendorMode = false,
  productData,
}: {
  isVendorMode?: boolean;
  productData?: any;
}): React.ReactElement {
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

  const baseurl = process.env.NEXT_PUBLIC_API_URL;
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [lastSavedDesign, setLastSavedDesign] = useState<string | null>(null);
  const canvasState = useSelector((state: RootState) => state.setReducer);
  const {
    addDesignToCart,
    updateCartItem,
    loading: cartLoading,
  } = useNewCart();
  const { isLogin } = useUserContext();
  const isAuthorized = isVendorMode || isLogin;
  const router = useRouter();
  const { svgUrl } = useSvgContext();
  const dispatchForCanvas = useDispatch();
  const [downloadStatus, setDownloadStatus] = React.useState("");
  const { svgcolors, dispatchColorPicker } =
    React.useContext(ColorPickerContext)!;
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;
  const { designs, dispatchDesign, currentBgColor, updateColor } =
    React.useContext(DesignContext)!;
  const design = designs.find((d) => d.isactive === true);
  const { handleZip } = useDownload();
  const { props, dispatchProps } = React.useContext(TextPropsContext)!;
  const [canvas, setCanvas] = React.useState<fabric.Canvas>();
  const [apparels, setApparels] = React.useState<IApparel[]>(designApparels);
  let selectionCreated: fabric.Object[] | undefined;
  const [cart, setCart] = React.useState<{ name: string; image: string }[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [colors, setColors] = React.useState<IBgcolor[]>(
    bgColours.map((color) => ({
      ...color,
      selected: color.value === currentBgColor,
    }))
  );
  const { store } = useStore();

  // State to store customer data from API
  const [customerData, setCustomerData] = useState<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    profile_photo: string | null;
    vendor_id: string;
  } | null>(null);

  // Fetch customer data from API
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/customer/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch customer data");
        const { data } = await response.json();
        setCustomerData({
          id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          profile_photo: data.profile_photo,
          vendor_id: data.vendor_id,
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setCustomerData(null);
      }
    };
    fetchCustomerData();
  }, []);

  // Use customerId from customerData instead of sessionStorage
  const customerId = customerData?.id || null;

  const autoSaveDesign = React.useCallback(() => {
    if (!canvas || !design) return;

    const currentCanvasJSON = JSON.stringify(canvas.toJSON());

    if (currentCanvasJSON !== lastSavedDesign) {
      const pngImage = canvas.toDataURL({ multiplier: 4 });
      const svgImage = canvas.toSVG();

      dispatchDesign({
        type: "STORE_DESIGN",
        currentDesign: design,
        selectedApparal: design.apparel,
        jsonDesign: canvas.toJSON(),
        pngImage: canvas.toJSON().objects.length ? pngImage : null,
        svgImage: svgImage,
      });

      setLastSavedDesign(currentCanvasJSON);
    }
  }, [canvas, design, dispatchDesign, lastSavedDesign]);

  useEffect(() => {
    if (!canvas) return;

    let autoSaveTimeout: NodeJS.Timeout | null = null;

    const debouncedAutoSave = () => {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);

      autoSaveTimeout = setTimeout(() => {
        autoSaveDesign();
      }, 500);
    };

    const handleObjectModified = () => debouncedAutoSave();
    const handleObjectMoving = () => debouncedAutoSave();
    const handleObjectScaling = () => debouncedAutoSave();
    const handleObjectRotating = () => debouncedAutoSave();

    const events = [
      { name: "object:modified", handler: handleObjectModified },
      { name: "object:moving", handler: handleObjectMoving },
      { name: "object:scaling", handler: handleObjectScaling },
      { name: "object:rotating", handler: handleObjectRotating },
    ];

    events.forEach(({ name, handler }) => canvas.on(name, handler));

    return () => {
      events.forEach(({ name, handler }) => canvas.off(name, handler));
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    };
  }, [canvas, autoSaveDesign]);

  useEffect(() => {
    if (canvas) {
      canvas.renderOnAddRemove = true;
      canvas.preserveObjectStacking = true;
      canvas.enableRetinaScaling = true;
      canvas.selection = true;
      canvas.hoverCursor = "pointer";
      canvas.defaultCursor = "default";
    }
  }, [canvas]);

  const handleImageClick = async (e: any, apparel: IApparel) => {
    e.preventDefault();
    autoSaveDesign();

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
        selectedApparal: { ...apparel, color: currentBgColor },
        jsonDesign: canvas?.toJSON(),
        pngImage: canvas?.toJSON().objects.length
          ? canvas?.toDataURL({ multiplier: 4 })
          : null,
        svgImage: canvas?.toSVG(),
      });
    }

    dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: currentBgColor });
  };

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
      if (selectionCreated[0].type === "group") {
        let colors = extractFillColorsSelectedObject(canvas.getActiveObject());
        dispatchColorPicker({ type: "SVG_COLORS", payload: colors });
      }
    }
  });

  canvas?.on("selection:cleared", function (options) {
    let deselectedObj = options.deselected;
    if (deselectedObj && deselectedObj.length > 0) {
      if (deselectedObj[0].type === "group") {
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

  canvas?.on("object:moving", () => {
    console.log("Object moving");
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
        payload: design.jsonDesign,
      });
    }
    getStackFromDB("undoStack", (storedUndoStack) => {
      dispatchForCanvas({ type: "SET_UNDO_STACK", payload: storedUndoStack });
    });

    getStackFromDB("redoStack", (storedRedoStack) => {
      dispatchForCanvas({ type: "SET_REDO_STACK", payload: storedRedoStack });
    });
    return () => {
      canvas.dispose();
    };
  }, [design, dispatchForCanvas]);

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

  const handleColorClick = (value: string) => {
    setColors(
      colors.map((color) =>
        color.value === value
          ? { ...color, selected: true }
          : { ...color, selected: false }
      )
    );
    updateColor(value);
  };

  const downloadDesignJson = (e: any) => {
    const json = JSON.stringify(designs);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
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

    link.setAttribute("download", design?.apparel.side ?? "design");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPNG = () => {
    const pngImage = canvas?.toDataURL({ multiplier: 4 }) ?? "";
    const link = document.createElement("a");
    link.href = pngImage;

    link.setAttribute("download", design?.apparel.side ?? "design" + ".png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadZip = () => {
    handleZip(designs);
  };

  const reset = () => {
    dispatchForCanvas({ type: "RESET" });
    dispatchDesign({ type: "CLEAR_ALL" });
    localStorage.removeItem("savedDesignState");
    localStorage.removeItem("savedPropsState");
    localStorage.removeItem("cart_id");
    router.refresh();
  };

  const handleUndo = () => {
    dispatchForCanvas({ type: "UNDO" });
  };

  const handleRedo = () => {
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

  const handleUpdateCart = async () => {
    const currentDesignState = designs.map((design) => ({
      ...design,
      svgImage: design.id === design?.id ? svgUrl : design.svgImage,
    }));
    const currentPropsState = {
      ...props,
      designId: design?.id,
    };

    if (!isLogin) {
      saveStateToLocalStorage();
      router.push("/auth");
      return;
    }

    const success = await updateCartItem(
      cartId!,
      currentDesignState,
      currentDesignState,
      currentPropsState
    );

    if (success) {
      dispatchDesign({ type: "CLEAR_ALL" });
      localStorage.removeItem("savedDesignState");
      localStorage.removeItem("savedPropsState");
      router.refresh();
    }
  };

  const addProduct = async () => {
    try {
      const pngImage = canvas?.toDataURL({ multiplier: 4 });

      const currentDesignState = designs.map((design) => ({
        ...design,
        svgImage: design.id === design?.id ? svgUrl : design.svgImage,
        pngImage:
          design.id === design?.id
            ? canvas?.toJSON().objects.length
              ? pngImage
              : null
            : design.pngImage,
      }));

      const currentPropsState = {
        ...props,
        designId: design?.id,
      };

      const requestBody = {
        vendor_id: store?.vendor_id || customerData?.vendor_id, // Use vendor_id from customerData if store is unavailable
        designs: designs,
        designstate: currentDesignState,
        propstate: currentPropsState,
        customizable: true,
        ...productData,
      };

      console.log("this is product request Body : ", requestBody);

      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const data = await response.json();
      console.log("this is product request : ", data);

      dispatchDesign({ type: "CLEAR_ALL" });
      localStorage.removeItem("savedDesignState");
      localStorage.removeItem("savedPropsState");

      router.refresh();

      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const handleAddToCart = async () => {
    const currentDesignState = designs.map((design) => ({
      ...design,
      svgImage: design.id === design?.id ? svgUrl : design.svgImage,
    }));

    const currentPropsState = {
      ...props,
      designId: design?.id,
    };

    if (!isLogin) {
      localStorage.setItem("pendingCartAdd", "true");
      localStorage.setItem(
        "pendingDesignState",
        JSON.stringify(currentDesignState)
      );
      localStorage.setItem(
        "pendingPropsState",
        JSON.stringify(currentPropsState)
      );
      saveStateToLocalStorage();
      router.push("/auth");
      return;
    }

    const success = await addDesignToCart(
      designs,
      currentDesignState,
      currentPropsState,
      productData?.id
    );

    if (success) {
      const response = await fetch(
        `${baseurl}/api/carts/customer/${customerId}` // Use customerId from state
      );
      if (response.ok) {
        const cartData = await response.json();
        const addedItem = cartData.data.designable_products.find(
          (item: any) =>
            JSON.stringify(item.designs) === JSON.stringify(currentDesignState)
        );
        if (addedItem) {
          setCartId(addedItem.id);
          localStorage.setItem("cart_id", addedItem.id);
        }
      }

      dispatchDesign({ type: "CLEAR_ALL" });
      localStorage.removeItem("savedDesignState");
      localStorage.removeItem("savedPropsState");
      localStorage.removeItem("pendingCartAdd");
      localStorage.removeItem("pendingDesignState");
      localStorage.removeItem("pendingPropsState");
      updateColor("#fff");
      dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: "#fff" });
    }
  };

  // Removed the redundant fetchCustomerData useEffect since we already have one at the top

  useEffect(() => {
    const checkPendingCartAdd = async () => {
      const hasPendingAdd = localStorage.getItem("pendingCartAdd");

      if (isLogin && hasPendingAdd === "true") {
        const pendingDesignStateStr =
          localStorage.getItem("pendingDesignState");
        const pendingPropsStateStr = localStorage.getItem("pendingPropsState");

        if (!pendingDesignStateStr || !pendingPropsStateStr) {
          return;
        }

        try {
          const pendingDesignState = JSON.parse(pendingDesignStateStr);
          const pendingPropsState = JSON.parse(pendingPropsStateStr);

          const success = await addDesignToCart(
            pendingDesignState,
            pendingDesignState,
            pendingPropsState,
            productData?.id
          );

          if (success) {
            const response = await fetch(
              `${baseurl}/api/carts/customer/${customerId}` // Use customerId from state
            );
            if (response.ok) {
              const cartData = await response.json();
              const addedItem = cartData.data.designable_products.find(
                (item: any) =>
                  JSON.stringify(item.designs) ===
                  JSON.stringify(pendingDesignState)
              );
              if (addedItem) {
                setCartId(addedItem.id);
                localStorage.setItem("cart_id", addedItem.id);
              }
            }

            dispatchDesign({ type: "CLEAR_ALL" });
            localStorage.removeItem("savedDesignState");
            localStorage.removeItem("savedPropsState");
            localStorage.removeItem("pendingCartAdd");
            localStorage.removeItem("pendingDesignState");
            localStorage.removeItem("pendingPropsState");
            updateColor("#fff");
            dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: "#fff" });
          }
        } catch (error) {
          console.error("Error processing pending cart addition:", error);
          localStorage.removeItem("pendingCartAdd");
          localStorage.removeItem("pendingDesignState");
          localStorage.removeItem("pendingPropsState");
        }
      }
    };

    const checkPendingCartUpdate = async () => {
      const hasPendingUpdate = localStorage.getItem("pendingCartUpdate");

      if (isLogin && hasPendingUpdate === "true") {
        const pendingDesignStateStr =
          localStorage.getItem("pendingDesignState");
        const pendingPropsStateStr = localStorage.getItem("pendingPropsState");
        const pendingCartId = localStorage.getItem("pendingCartId");

        if (!pendingDesignStateStr || !pendingPropsStateStr || !pendingCartId) {
          return;
        }

        try {
          const pendingDesignState: IDesign[] = JSON.parse(
            pendingDesignStateStr
          );
          const pendingPropsState: IProps & { designId?: string } =
            JSON.parse(pendingPropsStateStr);

          const success = await updateCartItem(
            pendingCartId,
            pendingDesignState,
            pendingDesignState,
            pendingPropsState
          );

          if (success) {
            dispatchDesign({ type: "CLEAR_ALL" });
            localStorage.removeItem("savedDesignState");
            localStorage.removeItem("savedPropsState");
            localStorage.removeItem("pendingCartUpdate");
            localStorage.removeItem("pendingDesignState");
            localStorage.removeItem("pendingPropsState");
            localStorage.removeItem("pendingCartId");
            updateColor("#fff");
            dispatchDesign({ type: "UPDATE_APPAREL_COLOR", payload: "#fff" });
          }
        } catch (error) {
          console.error("Error processing pending cart update:", error);
          localStorage.removeItem("pendingCartUpdate");
          localStorage.removeItem("pendingDesignState");
          localStorage.removeItem("pendingPropsState");
          localStorage.removeItem("pendingCartId");
        }
      }
    };

    checkPendingCartAdd();
    checkPendingCartUpdate();
  }, [
    isLogin,
    addDesignToCart,
    updateCartItem,
    svgUrl,
    dispatchDesign,
    updateColor,
    productData,
    customerId, // Use customerId from state
  ]);

  return (
    <div>
      <div className="flex justify-between mb-1">
        {(isVendorMode || isLogin) && (
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
              className="text-purple-700 hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-blue-800"
            >
              <IconContext.Provider
                value={{
                  size: "24px",
                  className: "btn-zip-design inline-block",
                }}
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
          {(isVendorMode || isLogin) && (
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
              <div className="text-purple-700 float-left hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:focus:ring-blue-800">
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
          <div className="text-purple-700 float-right hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:focus:ring-blue-800">
            <button onClick={handleRedo}>
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
          <div className="text-purple-700 float-right hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:focus:ring-blue-800">
            <button onClick={handleUndo}>
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
          <div className="text-purple-700 float-right hover:text-white border-purple-700 hover:bg-purple-800 focus:ring-1 border group bg-gradient-to-br group-hover:from-purple-600 group-hover:to-blue-500 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-1 py-1 text-center me-2 mb-2 dark:border-purple-500 dark:text-purple-500 dark:hover:text-white dark:focus:ring-blue-800">
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
        <div className={`inline-block p-2`}>
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
        <div className="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4">
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
        <div className="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4">
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

        <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-4 text-right">
          <button
            type="button"
            onClick={() =>
              isVendorMode
                ? addProduct()
                : cartId
                ? handleUpdateCart()
                : handleAddToCart()
            }
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
            <span className="ml-3">
              {isVendorMode
                ? "Add Product"
                : cartId
                ? `Update Cart`
                : `Add to Cart`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
