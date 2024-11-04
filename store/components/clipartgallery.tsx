"use client";
import { IconContext } from "react-icons";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { cliparts, DesignEnums, Item } from "@/@types/models";
import { MenuContext } from "../context/menucontext";
import * as React from "react";
import { useDispatch } from "react-redux";
import { ColorPicker } from '../components/colorpicker';
import { randomId } from "../shared/draw";
import { useSvgContext } from "@/context/svgcontext";

export function ClipartGallery(): React.ReactElement {
  const { setSvgUrl } = useSvgContext();
  const dispatchForCanvas = useDispatch();
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;
  const [selectedCliparts, setSelectedCliparts] = React.useState<string[]>([]);

  const handleClipartSelection = (svgUrl: string) => {
    setSelectedCliparts(prev => {
      const isSelected = prev.includes(svgUrl);
      if (isSelected) {
        return prev.filter(url => url !== svgUrl);
      } else {
        return [...prev, svgUrl];
      }
    });
  };

  const handleAddSelectedCliparts = async () => {
    if (selectedCliparts.length === 0) return;

    try {
      // Fetch all selected SVGs
      const svgFiles = await Promise.all(
        selectedCliparts.map(async (url) => {
          const response = await fetch(url);
          console.log("Response: ", response);
          const blob = await response.blob();
          console.log("Blob: ", blob)
          return new File([blob], `clipart-${randomId()}.svg`);
        })
      );

      // Create form data with all files
      const formData = new FormData();
      svgFiles.forEach(file => {
        formData.append('files', file);
      });

      // Upload combined SVGs
      const res = await fetch("/api/svguploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Praveen Kumar: ",data)
      if (data?.svgUrl && data?.pngUrl) {
        // Update the SVG context with the combined PNG URL
        setSvgUrl(data.pngUrl);

        // Add the combined SVG item to the canvas
        const svgItem: Item = {
          url: data.svgUrl,
          designItem: DesignEnums.svg,
          id: randomId() + '',
          isNew: true,
        };
        dispatchForCanvas({ type: "ADD_SVG_TO_CANVAS", payload: svgItem });

        // Clear selections after successful addition
        setSelectedCliparts([]);
      } else {
        console.error("Error in uploading images");
      }
    } catch (error) {
      console.error("Error processing cliparts:", error);
    }
  };

  const hideMainMenu =
    (menus.addDesign && (menus.addClippart || menus.addShape)) ||
    menus.uploadImage ||
    menus.addText ||
    menus.uploadDesign;

  return (
    (hideMainMenu && menus.addClippart && (
      <div className="border-r items-center text-black bg-white px-3 min-h-full animate-fade-left">
        <div className="flex justify-between items-center">
          <button
            className="relative inline-flex items-center justify-center p-0.5 my-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              dispatchMenu({ type: "TO_CLIPART_GALLERY", payload: false });
            }}
          >
            <IconContext.Provider value={{ color: "white", className: "global-class-name" }}>
              <div className="p-3">
                <FaArrowLeft />
              </div>
            </IconContext.Provider>
            <div className="relative px-2 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              <p className="pl-4">Back</p>
            </div>
          </button>

          {selectedCliparts.length > 0 && (
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              onClick={handleAddSelectedCliparts}
            >
              Add Selected ({selectedCliparts.length})
            </button>
          )}
        </div>

        <div className="columns-4 gap-5 mt-3 p-2">
          {cliparts.map((svg) => (
            <div
              className={`cursor-pointer border-2 rounded ${
                selectedCliparts.includes(svg.url)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-transparent hover:bg-zinc-200'
              }`}
              key={svg.url}
              onClick={() => handleClipartSelection(svg.url)}
            >
              <Image
                src={svg.url}
                className="w-full"
                alt="Image"
                width="100"
                height="100"
              />
            </div>
          ))}
        </div>

        <ColorPicker />
      </div>
    )) || <></>
  );
}