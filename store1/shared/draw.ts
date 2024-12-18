//Draw Rect
import { IProps } from "@/@types/models";
import { fabric } from "fabric";
export function AddRectFunc(canvas: any, stroke: string, fillcolor: string) {
 
  let rect = new fabric.Rect({
    left: 50,
    top: 100,
    fill: fillcolor,
    width: 100,
    height: 100,
    objectCaching: false,
    stroke: stroke,
    strokeWidth: 2,
  });

  canvas.add(rect);
  canvas.setActiveObject(rect);
}


export function AddTriangle(canvas: any, stroke: string, fillcolor: string) {
 
  let rect = new fabric.Triangle({
    left: 50,
    top: 100,
    width: 100,
    height: 100,
    fill: fillcolor,
    stroke: stroke,
    strokeWidth: 2,
    cornerColor: fillcolor,
    angle: 0,
  });

  canvas.add(rect);
  canvas.setActiveObject(rect);
}
export function AddCircle(canvas: any, stroke: string, fillcolor: string) {
  let rect = new fabric.Circle({
    left: 100,
    top: 150,
    radius: 50,
    fill: fillcolor,
    stroke: stroke,
    strokeWidth: 3,
    originX: 'center',
    originY: 'center'
  });

  canvas.add(rect);
  canvas.setActiveObject(rect);
}

// export function AddText(canvas: any, text: string, color: string,props:IProps) {
//   canvas.add(new fabric.IText(text, {
//     left: 50,
//     top: 80,
//     fontFamily: props.fontFamily,
//     fill: props.fillcolor,
//     fontSize: props.fontSize,
//     fontStyle: props.fontStyle,
//     fontWeight: props.fontWeight,
//     charSpacing: props.charSpacing,
//     lineHeight: props.lineHeight,
//     textBackgroundColor: props.bgColor,
//     textAlign: props.textAlign,
//   }));
// }




  // Set default values to the props
export function AddText(
    canvas: any,
    text: string,
    color: string,
    props: IProps | undefined
  ) {
    if (!props) {
      console.error("Invalid props object");
      return;
    }

    const fontFamily = props.fontFamily || "Arial";
    const fillcolor = props.fillcolor || "black";
    const fontSize = props.fontSize || 24;
    const fontStyle = props.fontStyle || "normal";
    const fontWeight = props.fontWeight || "normal";
    const charSpacing = props.charSpacing || 0;
    const lineHeight = props.lineHeight || 1;
    const textAlign = props.textAlign || "left";
    const bgColor = props.bgColor || "transparent";

    canvas.add(
      new fabric.IText(text, {
        left: 50,
        top: 80,
        fontFamily,
        fill: fillcolor,
        fontSize,
        fontStyle,
        fontWeight,
        charSpacing,
        lineHeight,
        textBackgroundColor: bgColor,
        textAlign,
      })
    );
  }








// left: 200,
// 			top: 100,
// 			textAlign: 'center',
// 			fill: '#FF0000',
// 			radius: 100,
// 			fontSize: 30,
// 			spacing: 7,
// 			effect:'STRAIGHT',
//       fontFamily: 'Arial'
export function AddSvg(canvas: any, svgurl: string, designId: string) {
  if (svgurl) {
    fabric.loadSVGFromURL(svgurl, (results, options) => {
      let designItem = fabric.util.groupSVGElements(results, options);
      let width = designItem.width || 1;
      let height = designItem.height || 1;
      let scaleX = (canvas.getWidth() - 20) / width;
      let scaleY = (canvas.getWidth() - 20) / height;
      designItem.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 0,
        hasBorders: true,
        cornerSize: 8,
        hasRotatingPoint: true,
        scaleX: scaleX,
        scaleY: scaleY,
        rotatingPointOffset: 10,
      });
      fabric.util.object.extend(designItem, { svgUid: designId })

      canvas.add(designItem);
      canvas.centerObject(designItem);
      canvas.setActiveObject(designItem)
      canvas.renderAll();
    });

  }
}

export function GetTextStyles(object: fabric.Object | undefined):IProps {
  if (!object) return {};

  return {
    //@ts-ignore
    fontSize: object.get("fontSize"),
    //@ts-ignore
    fontFamily: object.get("fontFamily"),
    //@ts-ignore
    fontWeight: object.get("fontWeight"),
    //@ts-ignore
    fontStyle: object.get("fontStyle"),
    //@ts-ignore
    underline: object.get("underline"),
    //@ts-ignore
    linethrough: object.get("linethrough"),
    //@ts-ignore
    overline: object.get("overline"),
    //@ts-ignore
    fill: object.get("fill"),
    //@ts-ignore
    charSpacing: object.get("charSpacing"),
    //@ts-ignore
    textBackgroundColor: object.get("textBackgroundColor"),
    //@ts-ignore
    lineHeight: object.get("lineHeight"),
  };
}

export function randomId() {
  return Math.floor(Math.random() * 999999) + 1;
}