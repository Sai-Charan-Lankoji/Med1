import { IDesign } from "@/@types/models";
import JSZip from "jszip";

const useDownload = () => {
  async function handleZip(designs:IDesign[]) {
    const zip = new JSZip();

    // Add Images to the zip file
    for(const design of designs){
        const blob = new Blob([design.svgImage], { type: "image/svg+xml" });
        zip.file(`${design.apparel.side}.svg`, blob);
    }


    // Generate the zip file
    const zipData = await zip.generateAsync({
      type: "blob",
      streamFiles: true,
    });

    // Create a download link for the zip file
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(zipData);
    link.download = "design.zip";
    link.click();
  }
  

  return { handleZip };
};

export { useDownload };