"use client";

import * as React from "react";
import { IconContext } from "react-icons";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { MenuContext } from "../context/menucontext";
import { DesignContext, TextPropsContext } from "../context/designcontext";
import { useDispatch } from "react-redux";
import { TextProps } from "./textprops";

export function AddText(): React.ReactElement {
  const { designs } = React.useContext(DesignContext)!;
  const design = designs.find((d) => d.isactive === true);
  const [inputValue, setInputValue] = React.useState("");
  const { props } = React.useContext(TextPropsContext)!;
  const dispatchForCanvas = useDispatch();
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;

  const hideMainMenu =
    (menus.addDesign && (menus.addClippart || menus.addShape)) ||
    menus.uploadImage ||
    menus.addText ||
    menus.uploadDesign;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendDataToCanvas(inputValue);
      setInputValue("");
    }
  };

  const handleButtonClick = () => {
    sendDataToCanvas(inputValue);
    setInputValue("");
  };

  const sendDataToCanvas = (text: string) => {
    dispatchForCanvas({ type: "TEXT", text, color: "#000000", props });
  };

  return (
    (hideMainMenu && menus.addText && (
      <div className="border-r items-center text-black bg-white p-3 mt-1 min-h-full lg:visible md:visible pb-5">
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-blue-600 group-hover:to-blue-800 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          onClick={() => dispatchMenu({ type: "TO_TEXT", payload: false })}
        >
          <IconContext.Provider
            value={{ color: "white", className: "global-class-name" }}
          >
            <div className="p-3">
              <FaArrowLeft />
            </div>
          </IconContext.Provider>
          <div className="relative px-2 py-2 transition-all ease-in duration-75 bg-white dark:bg-blue-900 rounded-md group-hover:bg-opacity-0">
            <p className="pl-4">Back</p>
          </div>
        </button>
        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <div className="flex mt-3">
          <input
            type="text"
            id="website-admin"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleEnterKey}
            className="rounded-none rounded-s-lg bg-gray-50 border border-blue-600 text-gray-900 focus:ring-blue-500 focus:border-purple-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-blue-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Add Text"
          />

          <button
            onClick={handleButtonClick}
            className="inline-flex items-center px-3 text-sm text-white bg-gradient-to-br from-purple-800 to-purple-800 border border-e-0 border-gray-300 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-blue-800 hover:text-blue-800 hover:dark:bg-white hover:dark:text-blue-800 hover:from-purple-100 hover:to-purple-200"
          >
            <FaPlus />
          </button>
        </div>
        <TextProps />
      </div>
    )) || <></>
  );
}
