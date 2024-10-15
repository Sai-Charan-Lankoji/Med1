'use client'

import { MainMenu } from "./mainmenu";
import { ClipartGallery } from "./clipartgallery";
import { ShapeGallery } from "./shapegallery";
import { UploadImage } from "./uploadImage";
import { UploadDesign } from "./uploaddesign";
import { AddText } from "./addtext";

export const SideNavBar = () => {


  return (
    <>
      {
        <div className="items-center text-black  border-spacing-2 ">
          <p className="lg:text-3xl sm:text-xl items-center w-full bg-purple-800 text-white p-4 border-spacing-2 border-zinc-800 rounded rounded-s-md">
            Create your Design
          </p>
          <div className="lg:h-[500px] xs:h-auto overflow-y-auto overflow-x-hidden scrollbar scrollbar-thin pb-5">
            <MainMenu></MainMenu>
            <ClipartGallery></ClipartGallery>
            <ShapeGallery></ShapeGallery>
            <UploadImage></UploadImage>
            <AddText></AddText>
            <UploadDesign></UploadDesign>
          </div>

        </div>
      }
    </>
  );
};
