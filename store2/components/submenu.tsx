"use client";

import * as React from 'react';
import { IconContext } from "react-icons";
import { FaRegEdit } from "react-icons/fa";
import { MenuContext } from '../context/menucontext'

export function SubMenus():React.ReactElement {
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;
  return menus.addDesign && (
    <div className="text-right">
      <button
        className=" relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        onClick={() => dispatchMenu({ type: 'TO_CLIPART_GALLERY', payload: true })}
      >
        <IconContext.Provider
          value={{ color: "white", className: "global-class-name" }}
        >
          <div className="p-3 w-18">
            <FaRegEdit />
          </div>
        </IconContext.Provider>
        <div className="w-65 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          <p className="pl-5">Clipart library</p></div>

      </button><br/>
      <button
       className=" relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
       onClick={() => dispatchMenu({ type: 'TO_SHAPE-GALLERY', payload: true })}
      >
        <IconContext.Provider
          value={{ color: "white", className: "global-class-name" }}
        >
           <div className="p-3 w-25">
            <FaRegEdit />
          </div>
        </IconContext.Provider>
        <div className="w-65 relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          <p className="pl-5">Shape library</p></div>
      </button>
    </div>
  ) || (<></>);
}
