"use client";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { useState, ChangeEvent, useContext, useEffect } from "react";
import { MenuContext } from "../context/menucontext";
import { DesignContext } from "../context/designcontext";
import { useDispatch } from "react-redux";
import { DesignEnums, Item } from "@/@types/models"; 
import { useUploadImage } from "@/app/hooks/useUploadImage";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export function UploadImage(): React.ReactElement { 
  const {  mutate: uploadImage } = useUploadImage();
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
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file)return; 
    try {
      const fileUrl = await uploadImage(file); 
      console.log("this is file url: " + fileUrl); 
      setImageUrl(fileUrl);
      dispatchDesign({ type: "UPLOADED_IMAGE", payload: fileUrl });
      
    } catch (error) {
      console.error("Error during file upload:", error);
      
    }


    // if (file && file.type.match(imageMimeType)) {
    //   setFile(file);
    // } else {
    //   alert("Image mime type is not valid");
    // }
  };

  useEffect(() => {
    let fileReader: FileReader | null = null;
    let isCancel = false;

    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent<FileReader>) => {//+
        const result = e.target?.result;//+
        if (result && !isCancel && typeof result === 'string') {//+
          dispatchDesign({ type: "UPLOADED_IMAGE", payload: result });//+
        }//+
      };//+
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader?.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file, dispatchDesign]);

  const uploadImageToServer = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // const formData = new FormData();
    // formData.append("file", file);
  
    try { 

      const fileUrl = await uploadImage(file); 
      console.log("this is file url: " + fileUrl);

      // Change this URL to your server endpoint
      // const res = await fetch("YOUR_SERVER_URL/upload", {
      //   method: "POST",
      //   body: formData,
      // }); 

      setImageUrl(fileUrl);
      dispatchDesign({ type: 'UPLOADED_IMAGE', payload: fileUrl });
  
      // if (!res.ok) {
      //   console.error("Error uploading image");
      //   return;
      // }
  
      // const data: { fileUrl: string } = await res.json();
      // setImageUrl(data.fileUrl);
      // dispatchDesign({ type: "UPLOADED_IMAGE", payload: data.fileUrl });
    } catch (error) {
      console.error("Error:", error);
    }
  
    // Reset file input type to trigger change event
    e.target.type = "text";
    e.target.type = "file";
  };
  

  const handleImageClick = (e: any, imageUrl: string) => {
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
          onClick={() => dispatchMenu({ type: "TO_UPLOAD_IMAGE", payload: false })}
        >
          <IconContext.Provider value={{ color: "white" }}>
            <div className="p-3">
              <FaArrowLeft />
            </div>
          </IconContext.Provider>
          <div className="relative px-2 py-2 bg-white dark:bg-gray-900 rounded-md">
            <p className="pl-4">Back</p>
          </div>
        </button>

        <div className="text-center">
          <div className="uploadOuter">
            <span className="dragBox">
              Drag and Drop image here
              <input type="file" onChange={handleFileChange} />
            </span>
          </div>
          <strong>OR</strong>
          <br />
          <button className="relative inline-flex items-center justify-center mt-2 p-0.5 mb-2 text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white">
            <IconContext.Provider value={{ color: "white" }}>
              <div className="p-3">
                <FaUpload />
              </div>
            </IconContext.Provider>
            <div className="relative px-2 py-2 bg-white dark:bg-gray-900 rounded-md">
              <label className="relative overflow-hidden">
                <p className="pl-4">Select Image</p>
                <input
                  style={{ display: "none" }}
                  type="file"
                  onChange={uploadImageToServer}
                />
              </label>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 my-5">
          {design?.uploadedImages?.map((image) => (
            <div key={image}>
              <img
                src={image}
                onClick={(e) => handleImageClick(e, image)}
                alt="Uploaded Images"
                className="border rounded hover:bg-zinc-200 hover:border-zinc-400 cursor-pointer w-full"
              />
            </div>
          ))}
        </div>
      </div>
    )) || <div></div>
  );
}
