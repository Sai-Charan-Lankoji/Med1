
import * as React from "react";
import { IconContext } from "react-icons";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
} from "react-icons/fa";
import { useDispatch } from "react-redux";

import { TextPropsContext } from "../context/designcontext";
export function TextProps(): React.ReactElement {
    const dispatchForCanvas = useDispatch();
    const { props, dispatchProps } = React.useContext(TextPropsContext)!;
 
    
    let [fontWeight, setFontWeight] = React.useState(props.fontWeight ?? "200");
    let [fontStyle, setFontStyle] = React.useState(props.fontStyle ?? "normal");
    let [textAlign, setTextAlign] = React.useState(props.textAlign ?? "left");
    let [fontFamily, setFontFamily] = React.useState(props.fontFamily ?? "arial");
    let [underline, setUnderline] = React.useState(props.underline ?? false);
    let [overline, setOverline] = React.useState(props.overline ?? false);
    let [linethrough, setLinethrough] = React.useState(props.linethrough ?? false);
    let [fontSize, setFontSize] = React.useState(props.fontSize ?? "12");
    let [fillcolor, setFillColor] = React.useState(props.fillcolor ?? "#0000ff");
    
    let [textBackgroundColor, setTextBackgroundColor] = React.useState(props.bgColor ?? "#ffffff");
    let [lineHeight, setLineHeight] = React.useState(props.lineHeight ?? "5");
    let [charSpacing, setCharSpacing] = React.useState(props.charSpacing ?? "10");
    
  const handleFontWeight = (e: any) => {
    let fw = fontWeight == "200" ? "800" : "200";
    dispatchForCanvas({ type: "PROPS", props: "fontWeight", value: fw });
    setFontWeight(fw);
    //textProps.fontWeight = fontWeight;
  };

  const handleFontSize = (e: any) => {
 
    setFontSize(e.target.value);
    dispatchForCanvas({
      type: "PROPS",
      props: "fontSize",
      value: e.target.value,
    });
    //textProps.fontSize = fontSize;
  };

  const handleFontFamily = (e: any) => {
    setFontFamily(e.target.value);
    dispatchForCanvas({
      type: "PROPS",
      props: "fontFamily",
      value: e.target.value,
    });
    //textProps.fontFamily = fontFamily;
  };

  const handleFontStyle = (e: any) => {
    let fs = fontStyle == 'normal' ? 'italic' : 'normal';
    dispatchForCanvas({ type: "PROPS", props: "fontStyle", value: fs });
    setFontStyle(fs as 'normal' | 'italic' | '');
    //textProps.fontStyle = fs;
  };

  const handleUnderline = (e: any) => {
    let ul = !underline;
    setUnderline(ul);
    dispatchForCanvas({ type: "PROPS", props: "underline", value: ul });
  };

  const handleOverline = (e: any) => {
    let ol = !overline;
    setOverline(ol);
    dispatchForCanvas({ type: "PROPS", props: "overline", value: ol });
  };

  const handleLinethrough = (e: any) => {
    let lt = !linethrough;
    setLinethrough(lt);
    dispatchForCanvas({ type: "PROPS", props: "linethrough", value: lt });
  };

  const handleFillcolor = (e: any) => {
    setFillColor(e.target.value);
    dispatchForCanvas({
      type: "PROPS",
      props: "fillcolor",
      value: e.target.value,
    });
  };
  const handleBgFillcolor = (e: any) => {
    setTextBackgroundColor(e.target.value);
    dispatchForCanvas({
      type: "PROPS",
      props: "textBackgroundColor",
      value: e.target.value,
    });
  };
  const handleCharSpacing = (e: any) => {
    setCharSpacing(e.target.value);
    dispatchForCanvas({ type: "PROPS", props: "charSpacing", value: e.target.value });
  };

  const handleLineHeight = (e: any) => {
    setLineHeight(e.target.value);
    dispatchForCanvas({ type: "PROPS", props: "lineHeight", value: e.target.value });
  };

  const handleTextAlignment =(e:any,alignment:string) => {
    setTextAlign(alignment);
    dispatchForCanvas({ type: "PROPS", props: "textAlign", value: alignment });
  }
    return (
        <>
        <div>
          <div className="text-indigo-950 font-mono font-bold pt-2 pb-2">
            Font family
          </div>
        </div>
        <div className="">
          <select
            className="rounded bg-gray-50 border border-purple-600 text-gray-900 focus:ring-purple-500 focus:border-purple-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-purple-700 dark:border-purple-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            onChange={(e) => handleFontFamily(e)}
            value={fontFamily}
          >
            <option value="arial">Arial</option>
            <option value="helvetica">Helvetica</option>
            <option value="verdana">Verdana</option>
            <option value="courier">Courier</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Zilla Slab">Zilla Slab</option>
            <option value="Lato">Lato</option>
            <option value="Bellefair">Bellefair</option>
            <option value="Fresca">Fresca</option>
            <option value="Raleway">Raleway</option>
            <option value="Open Sans Condensed">Open Sans Condensed</option>
            <option value="Indie Flower">Indie Flower</option>
            <option value="Josefin Sans">Josefin Sans</option>
            <option value="Inconsolata">Inconsolata</option>
            <option value="Pacifico">Pacifico</option>
            <option value="Gloria Hallelujah">Gloria Hallelujah</option>
          </select>
        </div>
         <div>
          <div className="text-indigo-950 font-mono font-bold pt-2 pb-2">
            Font Color:
          </div>
          <div>
            <input
              type="color" 
              value={fillcolor}
              onChange={(e) => handleFillcolor(e)}
            /> {fillcolor}
          </div>
          <div className="text-indigo-950 font-mono font-bold pt-2 pb-2">
            Font Bg Color:
          </div>
          <div>
            <input
              type="color"
              value={textBackgroundColor}
              onChange={(e) => handleBgFillcolor(e)}
            /> {textBackgroundColor}
          </div>
        </div>

        
        <div className="text-indigo-950 font-mono font-bold pt-2 pb-2">
          Text Align
        </div>
        <div className="flex w-max gap-1 flex-row">
          <button
            type="button"
            onClick={(e) => handleTextAlignment(e,'left')}
            className={`flex items-center rounded px-1 pb-1 pt-1.5 text-[8pt] font-medium uppercase leading-normal border-2 border-purple-800 + ${
              textAlign == "left"
                ? "text-blue-800 bg-white "
                : " text-white  bg-purple-800  hover:text-blue-800 hover:bg-white"
            } `}
          >
            <IconContext.Provider
              value={{
                size: "16px",
                className: `inline-block px-1 + ${
                  textAlign == "left" ? "" : "btn-download-design"
                }`,
              }}
            >
              <FaAlignLeft />
            </IconContext.Provider>
            <span> Left </span>
          </button>
          <button
            type="button"
            onClick={(e) => handleTextAlignment(e,'center')}
            className={`flex items-center rounded px-1 pb-1 pt-1.5 text-[8pt] font-medium uppercase leading-normal border-2 border-purple-700 + ${
              textAlign == "center"
                ? "text-blue-800 bg-white"
                : "text-white  bg-purple-800  hover:text-blue-800 hover:bg-white"
            } `}
          >
            <IconContext.Provider
              value={{
                size: "16px",
                className: `inline-block px-1 + ${
                  textAlign == "center" ? "" : "btn-download-design"
                }`,
              }}
            >
              <FaAlignCenter />
            </IconContext.Provider>
            Center
          </button>
          <button
            type="button"
            onClick={(e) => handleTextAlignment(e,'right')}
            className={`flex items-center rounded px-1 pb-1 pt-1.5 text-[8pt] font-medium uppercase leading-normal border-2 border-purple-800 + ${
              textAlign == "right"
                ? "text-blue-800 bg-white"
                : "text-white  bg-purple-800  hover:text-blue-800 hover:bg-white"
            } `}
          >
            <IconContext.Provider
              value={{
                size: "16px",
                className: `inline-block px-1 + ${
                  textAlign == "right" ? "" : "btn-download-design"
                }`,
              }}
            >
              <FaAlignRight />
            </IconContext.Provider>
            Right
          </button>
          <button
            type="button"
            onClick={(e) => handleTextAlignment(e,'justify')}
            className={`flex items-center rounded px-1 pb-1 pt-1.5 text-[8pt] font-medium uppercase leading-normal border-2 border-purple-800 + ${
              textAlign == "justify"
                ? "text-blue-800 bg-white"
                : "text-white  bg-purple-800  hover:text-blue-800 hover:bg-white"
            } `}
          >
            <IconContext.Provider
              value={{
                size: "16px",
                className: `inline-block px-1 + ${
                  textAlign == "justify" ? "" : "btn-download-design"
                }`,
              }}
            >
              <FaAlignJustify />
            </IconContext.Provider>
            Justify
          </button>
        </div>

        <div className="text-indigo-950 font-mono font-bold pt-2 pb-2">
          Font Style
        </div>
        <div className="flex w-max gap-1 flex-row">
          <button
            type="button"
            onClick={(e) => {
              handleFontWeight(e);
            }}
            className={`"flex items-center rounded px-1 pb-1 pt-1.5 text-[8pt]] font-medium  uppercase leading-normal" border-2 border-purple-800 + ${
              fontWeight == "800"
                ? "text-blue-800 font-extrabold bg-white  hover:bg-purple-800 hover:text-white"
                : "text-white bg-purple-800  hover:text-blue-800 hover:bg-white"
            }`}
          >
            <IconContext.Provider
              value={{
                size: "16px",
                className: `inline-block px-1 + ${
                  fontWeight == "800" ? "" : "btn-download-design"
                }`,
              }}
            >
              <FaBold />
            </IconContext.Provider>
            Bold
          </button>
          <button
            type="button"
            onClick={(e) => {
              handleFontStyle(e);
            }}
            className={`"flex items-center rounded  px-1 pb-1 pt-1.5 text-xs font-medium uppercase leading-normal" border-2 border-purple-800 + ${
              fontStyle == "italic"
                ? "text-blue-800 italic bg-white hover:bg-purple-800 hover:text-white"
                : "text-white bg-purple-800 hover:text-blue-800 hover:bg-white"
            }`}
          >
            <IconContext.Provider
              value={{
                size: "16px",
                className: `inline-block px-1 + ${
                  fontStyle == "italic" ? "" : "btn-download-design"
                }`,
              }}
            >
              <FaItalic />
            </IconContext.Provider>
            Italic
          </button>
        </div>

        <div className="text-indigo-950 font-mono font-bold pt-2 pb-2">
          Text Decoration
        </div>

        <div className="flex w-max gap-1 flex-row">
          <button
            type="button"
            onClick={(e) => handleUnderline(e)}
            className={`flex items-center rounded  px-1 pb-1 pt-1.5 text-[8pt] font-medium uppercase leading-normal border-2 border-purple-800 + ${
              underline
                ? "text-blue-800 bg-white hover:bg-purple-800 hover:text-white underline hover:no-underline"
                : "text-white bg-purple-800 hover:text-blue-800 hover:bg-white "
            }`}
          >
            <IconContext.Provider
              value={{
                size: "16px",
                className: `inline-block px-1 + ${
                  underline ? "" : "btn-download-design"
                }`,
              }}
            >
              <FaUnderline />
            </IconContext.Provider>
            Underline
          </button>
          <button
            type="button"
            onClick={(e) => handleOverline(e)}
            className={`flex items-center rounded  px-1 pb-1 pt-1.5 text-[8pt] font-normal uppercase leading-normal border-2 border-purple-800 + ${
              overline
                ? "text-blue-800 bg-white hover:bg-purple-800 hover:text-white overline"
                : "text-white bg-purple-800 hover:text-blue-800 hover:bg-white "
            }`}
          >
            Overline
          </button>
          <button
            type="button"
            onClick={(e) => handleLinethrough(e)}
            className={`flex items-center rounded  px-1 pb-1 pt-1.5 text-xs font-normal uppercase leading-normal border-2 border-purple-800 + ${
              linethrough
                ? "text-blue-800 bg-white hover:bg-purple-800 hover:text-white line-through"
                : "text-white bg-purple-800 hover:text-blue-800 hover:bg-white"
            }`}
          >
            <IconContext.Provider
              value={{
                size: "16px",
                className: `inline-block px-1 + ${
                  linethrough ? "" : "btn-download-design"
                }`,
              }}
            >
              <FaStrikethrough />
            </IconContext.Provider>
            Line Through
          </button>
        </div>

        <div>
          <div className="text-indigo-950 font-mono font-bold pt-2 pb-1">
            Font Size <span className="text-purple-700 text-bold">({fontSize})</span>
          </div>
          <div className="text-indigo-950 font-mono font-bold pt-2 pb-1">
            <input
              type="range"
              step="1"
              className="w-full"
              min="1"
              max="120"
              value={fontSize}
              onChange={(e) => handleFontSize(e)}
            ></input>
            
          </div>
        </div>

        <div>
          <div className="text-indigo-950 font-mono font-bold pt-2 pb-1">
            Line Height {lineHeight}
          </div>
          <div className="text-indigo-950">
            <input
              type="range"
              step="0.1"
              min="0"
              max="10"
              value={lineHeight}
              className="w-full"
              onChange={(e) => handleLineHeight(e)}
            ></input>
          </div>
        </div>

        <div>
          <div className="text-indigo-950 font-mono font-bold pt-2 pb-1">
            Char Spacing  {charSpacing}
          </div>
          <div className="custom-item-body">
            <input type="range" step="10" min="-150" max="800" value={charSpacing}
            className="w-full"
            onChange={(e) => handleCharSpacing(e)}
            ></input>
           
          </div>
        </div>
        </>
    )
}