"use client";
import * as React from "react";
import { IconContext } from "react-icons";
import { FaArrowLeft } from "react-icons/fa";
import {
  GoSquare,
  GoSquareFill,
  GoDot,
  GoDotFill,
  GoTriangleUp,
} from "react-icons/go";
import { MenuContext } from "../context/menucontext";
import { useDispatch } from "react-redux";
import { triangleIcon, triangleIconFill } from "@/@types/models";

export function ShapeGallery(): React.ReactElement {
  const { menus, dispatchMenu } = React.useContext(MenuContext)!;
  const dispatchForCanvas = useDispatch();
  const hideMainMenu =
    (menus.addDesign && (menus.addClippart || menus.addShape)) ||
    menus.uploadImage ||
    menus.addText ||
    menus.uploadDesign;
  const setStrokeColor = (e: any) => {
    dispatchForCanvas({
      type: "UPDATE_SHAPE_STROKE_COLOR",
      payload: { color: e.target.value },
    });
  };
  const setFillColor = (e: any) => {
    dispatchForCanvas({
      type: "UPDATE_SHAPE_FILL_COLOR",
      payload: { color: e.target.value },
    });
  };
  return (
    (hideMainMenu && menus.addShape && (
      <div className="border-r items-center text-black bg-white p-3 mt-1 min-h-full">
        <button
          className=" relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-b from-purple-800 to-purple-800 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          onClick={() =>
            dispatchMenu({ type: "TO_SHAPE-GALLERY", payload: false })
          }
        >
          <IconContext.Provider
            value={{ color: "white", className: "global-class-name" }}
          >
            <div className="p-3">
              <FaArrowLeft />
            </div>
          </IconContext.Provider>
          <div className="relative px-2 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            <p className="pl-4">Back</p>
          </div>
        </button>
        <div className="columns-6 gap-3 mt-3 p-2">
          <div className="text-zinc-400 text-[10px] flex items-center flex-wrap bg-white">
            <button
              type="button"
              style={{
                borderRadius: "5px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                dispatchForCanvas({
                  type: "SHAPE",
                  shape: "RECT",
                  stroke: "#000000",
                  fillcolor: "transparent",
                });
              }}
              className="hover:bg-zinc-200 cursor-pointer rounded text-[25px] flex  items-center border  bg-white border-zinc-950 border-50 mb-[1px] p-2 ml-2"
            >
              <IconContext.Provider
                value={{
                  color: "#000000",
                  className: "global-class-name",
                }}
              >
                <GoSquare />
              </IconContext.Provider>
            </button>
          </div>
          <div className="text-zinc-400 text-[10px] flex items-center flex-wrap bg-white">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatchForCanvas({
                  type: "SHAPE",
                  shape: "RECT",
                  stroke: "#000000",
                  fillcolor: "#0000ff",
                });
              }}
              className="hover:bg-zinc-200 cursor-pointer rounded text-[25px] flex  items-center border  bg-white border-zinc-950 border-50 mb-[1px] p-2 ml-2"
            >
              <IconContext.Provider
                value={{
                  color: "#000000",
                  className: "global-class-name",
                }}
              >
                <GoSquareFill />
              </IconContext.Provider>
            </button>
          </div>
          <div className="text-zinc-400 text-[10px] flex items-center flex-wrap bg-white">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatchForCanvas({
                  type: "SHAPE",
                  shape: "CIRCLE",
                  stroke: "#000000",
                  fillcolor: "transparent",
                });
              }}
              className="hover:bg-zinc-200 cursor-pointer rounded text-[25px] flex  items-center border  bg-white border-zinc-950 border-50 mb-[1px] p-2 ml-2"
            >
              <IconContext.Provider
                value={{
                  color: "#000000",
                  className: "global-class-name",
                }}
              >
                <GoDot />
              </IconContext.Provider>
            </button>
          </div>
          <div className="text-zinc-400 text-[10px] flex items-center flex-wrap bg-white">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatchForCanvas({
                  type: "SHAPE",
                  shape: "CIRCLE",
                  stroke: "#000000",
                  fillcolor: "#0000ff",
                });
              }}
              className="hover:bg-zinc-200 cursor-pointer rounded text-[25px] flex  items-center border  bg-white border-zinc-950 border-50 mb-[1px] p-2 ml-2"
            >
              <IconContext.Provider
                value={{
                  color: "#000000",
                  className: "global-class-name",
                }}
              >
                <GoDotFill />
              </IconContext.Provider>
            </button>
          </div>

          <div className="text-zinc-400 text-[10px] flex items-center flex-wrap bg-white">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatchForCanvas({
                  type: "SHAPE",
                  shape: "TRIANGLE",
                  stroke: "#000000",
                  fillcolor: "#ffffff",
                });
              }}
              className="hover:bg-zinc-200  cursor-pointer rounded text-[25px] flex  items-center border  bg-white border-zinc-950 border-50 mb-[1px] p-1 ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
              >
                <path
                  d="M14 5 L3 18 L24 18 L14 5"
                  stroke="black"
                  strokeWidth="2"
                  fill="white"
                />
              </svg>
            </button>
          </div>

          <div className="text-zinc-400 text-[10px] flex items-center flex-wrap bg-white">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatchForCanvas({
                  type: "SHAPE",
                  shape: "TRIANGLE",
                  stroke: "#000000",
                  fillcolor: "#0000ff",
                });
              }}
              className="hover:bg-zinc-200 cursor-pointer font-black rounded text-[25px] flex  items-center border  bg-white border-zinc-950 border-50 mb-[1px] p-2 ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
              >
                <path
                  d="M14 5 L3 18 L24 18 L14 5"
                  stroke="black"
                  strokeWidth="2"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <div className="flex-row pl-10">
            <div className="text-lg text-zinc-700 pt-10">Change Colors:</div>
            <div className="flex-col pt-2 text-left ">
              <span className="mr-8">Stroke Color</span>
              <input
                key="1"
                type="color"
                value="#ffffff"
                onChange={(e) => setStrokeColor(e)}
              />
            </div>
            <div className="flex-col pt-2 text-left">
              <span className="mr-[60px]">Fill Color</span>
              <input
                key="1"
                type="color"
                value="#0000ff"
                onChange={(e) => setFillColor(e)}
              />
            </div>
          </div>
        </div>
      </div>
    )) || <></>
  );
}
