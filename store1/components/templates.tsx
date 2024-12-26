import { IDesign } from "@/@types/models";
import { DesignContext } from "../context/designcontext";
import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Template() {
  const { designs, dispatchDesign } = React.useContext(DesignContext)!;
  const [bgColor, setBgColor] = React.useState();
  const [hoveredDesign, setHoveredDesign] = React.useState<string | null>(null);

  const onDesignSelected = async (e: any, design: IDesign) => {
    e.preventDefault();
    
    // Animate selection
    dispatchDesign({ 
      type: "SWITCH_DESIGN", 
      currentDesign: design 
    });
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
    <div className="mt-6 px-2">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Saved Designs</h3>
      <div className="space-y-4">
        {designs
          .filter((d) => d.pngImage != null)
          .map((design) => (
            <motion.div 
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div 
                className={`
                  relative w-24 h-32 
                  rounded-lg overflow-hidden
                  shadow-sm
                  transition-all duration-300 ease-in-out
                  ${design.isactive ? 'ring-2 ring-purple-500 ring-offset-2' : 'ring-1 ring-gray-200'}
                  ${hoveredDesign === design.id ? 'transform scale-105' : ''}
                `}
                onMouseEnter={() => setHoveredDesign(design.id)}
                onMouseLeave={() => setHoveredDesign(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                
                <Image
                  src={design.pngImage}
                  alt={design.apparel.side}
                  layout="fill"
                  objectFit="contain"
                  className={`
                    cursor-pointer
                    transition-transform duration-300 ease-in-out
                    ${hoveredDesign === design.id ? 'scale-110' : 'scale-100'}
                  `}
                  onClick={(e) => onDesignSelected(e, design)}
                />

                <div className="absolute bottom-0 left-0 right-0 z-20 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">
                      {design.apparel.side}
                    </span>
                    {design.isactive && (
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                      </span>
                    )}
                  </div>
                </div>

                {hoveredDesign === design.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-30 bg-black bg-opacity-40 flex items-center justify-center"
                  >
                    <button
                      onClick={(e) => onDesignSelected(e, design)}
                      className="bg-white bg-opacity-90 text-gray-800 text-xs font-medium px-3 py-1 rounded-full
                        hover:bg-opacity-100 transition-all duration-200"
                    >
                      Select Design
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="mt-2">
                <div className="flex items-center gap-2">
                  {design.isactive && (
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                      Active
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Side {designs.findIndex(d => d.id === design.id) + 1}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

        {designs.filter(d => d.pngImage != null).length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">No saved designs yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Your designs will appear here as you create them
            </p>
          </div>
        )}
      </div>
    </div>
  );
}