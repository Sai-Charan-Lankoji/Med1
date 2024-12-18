"use client"; // next.js app router

import * as React from "react";
import { SideNavBar } from "@/components/sidenavbar";
import DesignArea from "@/components/designarea";
import { DesignProvider, TextPropsProvider } from "@/context/designcontext";
import { ColorPickerProvider } from "@/context/colorpickercontext";
import { MenuProvider } from "@/context/menucontext";
import { store } from "@/reducer/store";
import { Provider } from "react-redux";
import { Template } from "@/components/templates";
import { useParams, useRouter } from "next/navigation";
import {NEXT_PUBLIC_VENDOR_ID} from "@/constants/constants";

const VendorDesignCanvas = () => {
    const params = useParams();
    const router = useRouter();
    const vendorId = params.vendorId as string;
 
    React.useEffect(() => {
        // Verify vendor ID
        if (vendorId !== NEXT_PUBLIC_VENDOR_ID) {
          // Redirect to unauthorized or home page if vendor ID is invalid
           router.push('/');
        }
      }, [vendorId, router]);
    
      // If vendor ID is invalid, return null to prevent rendering
      if (vendorId !== NEXT_PUBLIC_VENDOR_ID) {
        return null;
      }

  return (
    <Provider store={store}>
      <DesignProvider>
        <MenuProvider>
          <TextPropsProvider>
            <ColorPickerProvider>
              <div className="lg:px-10 md:px-10 sm:px-0 mt- pt-28">
                <div className="grid grid-cols-12 gap-3 px-10 mt-3">
                  <div className="lg:col-span-3 md:col-span-12 sm:col-span-12 col-span-12">
                    <SideNavBar></SideNavBar>
                  </div>
                  <div className="lg:col-span-7 md:col-span-12 sm:col-span-12 col-span-12">
                    <main className="designarea">
                      <DesignArea  isVendorMode={true}/>
                    </main>
                  </div>
                  <div className="col-span-2">
                    <Template></Template>
                  </div>
                </div>
              </div>
            </ColorPickerProvider>
          </TextPropsProvider>
        </MenuProvider>
      </DesignProvider>
    </Provider>
  );
};

export default VendorDesignCanvas;
