"use client";
import { IconContext } from "react-icons";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { cliparts, DesignEnums, Item } from "@/@types/models";
import { MenuContext } from "../context/menucontext";
import * as React from "react";
import { useDispatch } from "react-redux";
import { ColorPicker } from "./colorpicker";
import { randomId } from "../shared/draw";
import { useSvgContext } from "@/context/svgcontext";

export function ClipartGallery(): React.ReactElement {
  const { setSvgUrl } = useSvgContext();

  const dispatchForCanvas = useDispatch();
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;

  const handleSvgUrl = async (e: React.MouseEvent, svgurl: string) => {
    e.stopPropagation();
    console.log(svgurl);

    const response = await fetch(svgurl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("file", new File([blob], "image.svg"));

    const res = await fetch("/api/svguploads", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data?.fileUrl) {
      console.log("this is the data : ", data?.fileUrl);
      // add the svg item to the canvas
      setSvgUrl(data?.fileUrl);
    } else {
      console.log("Error in uploading image");
    }

    const svgItem: Item = {
      url: svgurl,
      designItem: DesignEnums.svg,
      id: randomId() + "",
      isNew: true,
    };
    dispatchForCanvas({ type: "ADD_SVG_TO_CANVAS", payload: svgItem });
  };
  const hideMainMenu =
    (menus.addDesign && (menus.addClippart || menus.addShape)) ||
    menus.uploadImage ||
    menus.addText ||
    menus.uploadDesign;

  return (
    (hideMainMenu && menus.addClippart && (
      <div className="border-r items-center text-black bg-white px-3  min-h-full animate-fade-left">
        <button
          className=" relative inline-flex items-center justify-center p-0.5 my-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          onClick={(e) => {
            e.stopPropagation();
            dispatchMenu({ type: "TO_CLIPART_GALLERY", payload: false });
          }}
        >
          <IconContext.Provider
            value={{ color: "white", className: "global-class-name" }}
          >
            <div className="p-3">
              <FaArrowLeft />
            </div>
          </IconContext.Provider>
          <div className="relative px-2 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            <p className="pl-4">Back</p>
          </div>
        </button>

        <div className="columns-4 gap-5 mt-3 p-2">
          {cliparts.map((svg) => (
            <div
              className=" hover:bg-zinc-200 hover:rounded hover:border-zinc-400 hover:border cursor-pointer"
              key={svg.url}
            >
              <Image
                src={svg.url}
                className="w-full"
                key={svg.url}
                alt="Image"
                width="100"
                height="100"
                onClick={(e) => handleSvgUrl(e, svg.url)}
              />
            </div>
          ))}
        </div>

        <ColorPicker></ColorPicker>
      </div>
    )) || <></>
  );
}
