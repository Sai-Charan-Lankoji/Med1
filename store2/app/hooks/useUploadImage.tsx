'use client'
import React from "react";
import { DesignContext } from "@/context/designcontext";



export const useUploadImage = () => { 
  const { designs, dispatchDesign } = React.useContext(DesignContext)!;
const design = designs.find((d) => d.isactive === true); 

const side =  design?.apparel.side

    const uploadImage = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file );
  const baseUrl  = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/store/imageupload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      const data = await response.json();
      console.log("Upload response data:", data); 
      return data.fileUrl; 
    };
  
    return { mutate: uploadImage };
  };

  
  