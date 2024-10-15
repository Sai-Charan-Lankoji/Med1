"use client";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { useState, ChangeEvent, useContext,useEffect } from "react";
import { MenuContext } from "../context/menucontext";
import { DesignContext } from "../context/designcontext";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { DesignEnums, Item } from "@/@types/models";
const imageMimeType = /image\/(png|jpg|jpeg)/i;
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

  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);


  const changeHandler = (e:any) => {
    const file = e.target.files[0];
    console.log(file.type);
    
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
  }

  useEffect(() => {
    let fileReader:any, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e:any) => {
        const { result } = e.target;
        if (result && !isCancel) {
          //console.log(result);
          //design?.uploadedImages?.push(result);
          dispatchDesign({type:"UPLOADED_IMAGE",payload:result});
        }
      }
      fileReader.readAsDataURL(file);
      
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [file]);

  const onImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      console.warn("no file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("something went wrong, check your console.");
        return;
      }

      const data: { fileUrl: string } = await res.json();

      setImageUrl(data.fileUrl);
      dispatchDesign({type:"UPLOADED_IMAGE",payload:data.fileUrl});
    } catch (error) {
      console.error("something went wrong, check your console.");
    }

    /** Reset file input */
    e.target.type = "text";
    e.target.type = "file";

    console.log(imageUrl);
    
    console.log(designs);
    

  };

  
  const handleImageClick = (e: any, imageUrl: string) => {
    e.preventDefault();
    const imageItem: Item = {
      uploadImageUrl: imageUrl,
      designItem: DesignEnums.image,
      isNew: true,
    };
    dispatchDesign({type:"ADD_UPLOAD_DESIGN",payload:imageItem})
    dispatchForCanvas({type:"IMAGE",payload:imageUrl})
    
  };
  return (
    (hideMainMenu && menus.uploadImage && (
      <div className="border-r items-center text-black bg-white p-3 mt-1 min-h-full">
        <button
          className=" relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
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
              Darg and Drop image here
              <input type="file" id="uploadFile" />
            </span>
          </div>
          <strong>OR</strong>
          <br />
          <button className=" relative inline-flex items-center justify-center mt-2 p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <IconContext.Provider
              value={{ color: "white", className: "global-class-name" }}
            >
              <div className="p-3">
                <FaUpload />
              </div>
            </IconContext.Provider>
            <div className="relative px-2 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              <label
                className="relative overflow-hidden"
                style={{ paddingTop: `calc(100% * (${446} / ${720}))` }}
              >
                <p className="pl-4">Select Image</p>
                <input
                  style={{ display: "none" }}
                  type="file"
                  onChange={changeHandler}
                />
              </label>
            </div>
          </button>
        </div>

        <div className={`grid grid-cols-4 gap-4 my-5`}>

        {design?.uploadedImages?.map((image) => (
              <div  key = {image} className={` `}>
                <img
                  src={image}
                  onClick={(e) => handleImageClick(e, image)}
                  alt="Uploaded Images"
                 
                  className="border rounded hover:bg-zinc-200 hover:border-zinc-400 border-zinc-500 cursor-pointer w-full"
                />
              </div>
            ))}
            </div>
      </div>
    )) || <></>
  );
}

// 20240530_010642-1718622466958-184967016.png
