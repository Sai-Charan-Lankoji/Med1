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

const DesignCanvas = () => {
  return (
    <Provider store={store}>
      <DesignProvider>
        <MenuProvider>
          <TextPropsProvider>
            <ColorPickerProvider>
              <div className="lg:px-10 md:px-10 sm:px-0">
                <div className="grid grid-cols-12 gap-3 px-10 mt-3">
                  <div className="lg:col-span-3 md:col-span-12 sm:col-span-12 col-span-12">
                    <SideNavBar></SideNavBar>
                  </div>
                  <div className="lg:col-span-7 md:col-span-12 sm:col-span-12 col-span-12">
                    <main className="designarea">
                      <DesignArea></DesignArea>
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

export default DesignCanvas;
