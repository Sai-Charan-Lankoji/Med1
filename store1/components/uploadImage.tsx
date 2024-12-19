import React, { useState, useContext } from "react";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { MenuContext } from "../context/menucontext";
import { DesignContext } from "../context/designcontext";
import { useDispatch } from "react-redux";
import { DesignEnums, Item } from "@/@types/models";
import Image from 'next/image';

export function UploadImage(): React.ReactElement {
  const { menus, dispatchMenu } = useContext(MenuContext)!;
  const dispatchForCanvas = useDispatch();
  const { designs, dispatchDesign } = useContext(DesignContext)!;
  const design = designs.find((d) => d.isactive === true);

  const hideMainMenu =
    (menus.addDesign && (menus.addClippart || menus.addShape)) ||
    menus.uploadImage ||
    menus.addText ||
    menus.uploadDesign;

  const [isUploading, setIsUploading] = useState(false);

  const onImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      console.warn("No file was chosen");
      return;
    }
  
    setIsUploading(true);
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    try {
      const res = await fetch("http://localhost:5000/api/files", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }
  
       dispatchDesign({ type: "UPLOADED_IMAGE", payload: data.fileUrl });
  
      const imageItem: Item = {
        uploadImageUrl: data.fileUrl,
        designItem: DesignEnums.image,
        isNew: true,
      };
      dispatchDesign({ type: "ADD_UPLOAD_DESIGN", payload: imageItem });
  
      // Check if the canvas is available before dispatching the image to it
      const canvas = document.getElementById('yourCanvasId') as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          dispatchForCanvas({ type: "IMAGE", payload: data.fileUrl });
        } else {
          console.error("Canvas context is null");
        }
      } else {
        console.error("Canvas is null");
      }
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  
    e.target.value = ""; // Reset file input
  };
  

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.preventDefault();
    const imageItem: Item = {
      uploadImageUrl: imageUrl,
      designItem: DesignEnums.image,
      isNew: true,
    };
    dispatchDesign({ type: "ADD_UPLOAD_DESIGN", payload: imageItem });
    dispatchForCanvas({ type: "IMAGE", payload: imageUrl });
  };
  
  return (
    (hideMainMenu && menus.uploadImage && (
      <div className="border-r items-center text-black bg-white p-3 mt-1 min-h-full">
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          onClick={() =>
            dispatchMenu({ type: "TO_UPLOAD_IMAGE", payload: false })
          }
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
        <div className="text-center">
          <div className="uploadOuter">
            <span className="dragBox">
              Drag and Drop image here
              <input type="file" id="uploadFile" onChange={onImageFileChange} accept="image/*" />
            </span>
          </div>
          <strong>OR</strong>
          <br />
          <button className="relative inline-flex items-center justify-center mt-2 p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" disabled={isUploading}>
            <IconContext.Provider
              value={{ color: "white", className: "global-class-name" }}
            >
              <div className="p-3">
                <FaUpload />
              </div>
            </IconContext.Provider>
            <div className="relative px-2 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              <label className="relative overflow-hidden cursor-pointer">
                <p className="pl-4">{isUploading ? 'Uploading...' : 'Select Image'}</p>
                <input
                  type="file"
                  onChange={onImageFileChange}
                  className="hidden"
                  accept="image/*"
                  disabled={isUploading}
                />
              </label>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 my-5">
          {design?.uploadedImages?.map((image, index) => (
            <div key={index} className="">
              <Image
                src={image}
                width={100}
                height={100}
                onClick={(e) => handleImageClick(e, image)}
                alt={`Uploaded Image ${index + 1}`}
                className="border rounded hover:bg-zinc-200 hover:border-zinc-400 border-zinc-500 cursor-pointer w-full"
              />
            </div>
          ))}
        </div>
      </div>
    )) || <></>
  );
}