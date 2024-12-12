"use client";

import * as React from 'react';
import { IconContext } from "react-icons";
import { FaChess, FaUpload, FaTextWidth } from "react-icons/fa";
import { SubMenus } from "./submenu";
import { MenuContext } from '../context/menucontext'

export function MainMenu(): React.ReactElement {
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;
  const hideMainMenu =
    (menus.addDesign &&
      (menus.addClippart || menus.addShape)) ||
      menus.uploadImage ||
      menus.addText ||
      menus.uploadDesign;

  return !hideMainMenu && (
    <div className='py-2 '>
      <button
        className="relative w-full md:w-50 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-r from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        onClick={(e) => {e.stopPropagation(); dispatchMenu({ type: 'TO_DESIGN_MENU', payload: true })}}
        type="button"
      >
        <IconContext.Provider
          value={{ color: "white", className: "global-class-name" }}
        >
          <div className="p-5 w-20">
            <FaChess />
          </div>
        </IconContext.Provider>
        <div className="w-96 flex-col py-2.5  transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          <p>Add Design <br/><span className="text-sm">Cliparts, Shapes, Draw etc.</span></p>
          {/* <p className="text-sm"></p> */}
        </div>
      </button>
      {(
        <SubMenus></SubMenus>
      )}
      <button
       className="relative w-full md:w-50 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-r from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
       onClick={() => dispatchMenu({ type: 'TO_UPLOAD_IMAGE', payload: true })}
        type="button"
      >
        <IconContext.Provider
          value={{ color: "white", className: "global-class-name;" }}
        >
          <div className="p-5 w-20">
            <FaUpload />
          </div>
        </IconContext.Provider>
        <div className="w-96 text-center relative flex-col px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          <p className="pt-2 pb-2">Upload Images</p>
        </div>
      </button>
      <button
       className="relative w-full md:w-50 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-r from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
       onClick={() => dispatchMenu({ type: 'TO_TEXT', payload: true })}
        type="button"
      >
        <IconContext.Provider
          value={{ color: "white", className: "global-class-name" }}
        >
          <div className="p-5 w-20">
            <FaTextWidth />
          </div>
        </IconContext.Provider>
        <div className="w-96 text-center relative flex-col px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          <p className="pt-2 pb-2"> Add Text</p>
        </div>
      </button>
      <button
        className="relative w-full md:w-50 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        onClick={() => dispatchMenu({ type: 'TO_UPLOAD_DESIGN', payload: true })}
        type="button"
      >
        <IconContext.Provider
          value={{ color: "white", className: "global-class-name" }}
        >
          <div className="p-5 w-20">
            <FaUpload />
          </div>
        </IconContext.Provider>
        <div className="w-96 text-center relative flex-col px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          <p className="pt-2 pb-2"> Upload Designs</p>
        </div>
      </button>
    </div>
  ) || <></>;
}
