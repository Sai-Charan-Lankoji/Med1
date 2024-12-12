import { IDesign } from "@/@types/models";
import { DesignContext } from "../context/designcontext";
import * as React from "react";
import Image from "next/image";

export function Template() {
  const { designs, dispatchDesign } = React.useContext(DesignContext)!; 
  const [bgColor, setBgColor] = React.useState();
  const onDesignSelected = (e: any, design: IDesign) => {
    dispatchDesign({ type: "SWITCH_DESIGN", currentDesign: design });
  }; 


  React.useEffect(() => {
    const savedState = localStorage.getItem('designState');
    if (savedState) { 
      const parsedState = JSON.parse(savedState); 
      setBgColor(parsedState.currentBgColor);
     
    
      localStorage.removeItem('designState');
    }
  }, []);



  return (
    <div className="mt-12 ">
      {designs
        .filter((d) => d.pngImage != null)
        .map((design) => (
          <>
            <div className="relative w-10 h-20 " key={design.id}>
              {/* <Image
                src={design.apparel.url}
                alt="Apparel`"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                style={{ backgroundColor: bgColor }}
              /> */}

              <Image
                src={design.pngImage}
                alt={design.apparel.side}
                layout="fill"
                objectFit="contain"
                className="cursor-pointer py-1 px-1 mb-1 border border-spacing-1 border-purple-200 hover:bg-zinc-200 hover:border-zinc-800" 
                onClick={(e) => onDesignSelected(e, design)}

                
              />
              
            </div>
          </>
        ))}
    </div>
  );
}
