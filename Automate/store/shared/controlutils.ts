import { fabric } from "fabric";
import rgb2hex from 'rgb2hex';
import { deleteIcon, cloneIcon, rotateIcon, imgCursor, resizeIcon, IsvgColor } from "@/@types/models";

let NOT_ALLOWED_CURSOR = ''
const generateIconImage = (image: string) => {
  return function (
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    const size = fabricObject.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    if (fabricObject.angle)
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    if (size) {
      let img = document.createElement("img");
      img.src = image;
      ctx.drawImage(img, (-size * 3) / 2, (-size * 3) / 2, size * 3, size * 3);
    }
    ctx.restore();
  };
};

function deleteObject(eventData: MouseEvent, transform: fabric.Transform) {
  let target = transform.target;
  let canvas = target.canvas;
  if (canvas) {
    canvas.remove(target);
    canvas.requestRenderAll();
  }
  return true;
}

function cloneObject(eventData: MouseEvent, transform: fabric.Transform) {
  let target = transform.target;
  let canvas: any = target.canvas;
  target.clone(function (cloned: any) {
    cloned.left += 10;
    cloned.top += 10;
    canvas.add(cloned);
  });
  return true;
}

function mouseRotateIcon(angle: number) {
  const relativeAngle: number = angle - 90;
  const pos = {
    '-90': '9.25 5.25',
    '-75': '9.972 3.863',
    '-60': '10.84 1.756',
    '-45': '11.972 -1.716',
    '-30': '18.83 0.17',
    '-15': '28.49 -9.49',
    '15': '-7.985 46.77',
    '30': '-0.415 27.57',
    '45': '2.32 21.713',
    '60': '3.916 18.243',
    '75': '4.762 16.135',
    '90': '5.25 14.75',
    '105': '5.84 13.617',
    '120': '6.084 12.666',
    '135': '6.317 12.01',
    '150': '6.754 11.325',
    '165': '7.06 10.653',
    '180': '7.25 10',
    '195': '7.597 9.43',
    '210': '7.825 8.672',
    '225': '7.974 7.99',
    '240': '8.383 7.332',
    '255': '8.83 6.441',
  },
    defaultPos = '7.25 10';
  let d = relativeAngle + '';
  // @ts-ignore
  const transform = relativeAngle === 0 ? 'translate(9.5 3.5)' : `rotate(${relativeAngle} ${pos[d] || defaultPos})`
  const imgCursor = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='24' height='24'>
      <defs>
        <filter id='a' width='266.7%' height='156.2%' x='-75%' y='-21.9%' filterUnits='objectBoundingBox'>
          <feOffset dy='1' in='SourceAlpha' result='shadowOffsetOuter1'/>
          <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='1'/>
          <feColorMatrix in='shadowBlurOuter1' result='shadowMatrixOuter1' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/>
          <feMerge>
            <feMergeNode in='shadowMatrixOuter1'/>
            <feMergeNode in='SourceGraphic'/>
          </feMerge>
        </filter>
        <path id='b' d='M1.67 12.67a7.7 7.7 0 0 0 0-9.34L0 5V0h5L3.24 1.76a9.9 9.9 0 0 1 0 12.48L5 16H0v-5l1.67 1.67z'/>
      </defs>
      <g fill='none' fill-rule='evenodd'><path d='M0 24V0h24v24z'/>
        <g fill-rule='nonzero' filter='url(#a)' transform='${transform}'>
          <use fill='#e7493e' fill-rule='evenodd' xlink:href='#b'/>
          <path stroke='#FFF' d='M1.6 11.9a7.21 7.21 0 0 0 0-7.8L-.5 6.2V-.5h6.7L3.9 1.8a10.4 10.4 0 0 1 0 12.4l2.3 2.3H-.5V9.8l2.1 2.1z'/>
        </g>
      </g>
    </svg>`)
  return `url("data:image/svg+xml;charset=utf-8,${imgCursor}") 12 12, crosshair`
}

function treatAngle(angle: number) {
  return angle - angle % 15
}

function rotationStyleHandler(eventData: MouseEvent, control: any, fabricObject: any) {
  if (fabricObject.lockRotation) {
    return NOT_ALLOWED_CURSOR;
  }
  const angle = treatAngle(fabricObject.angle);
  return mouseRotateIcon(angle)
}


export function initControls() {
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = "#e7493e";
  fabric.Object.prototype.cornerStyle = "rect";
  fabric.Object.prototype.cornerStrokeColor = "#e7493e";
  fabric.Object.prototype.cornerSize = 8;
  fabric.Object.prototype.controls.mtr.visible = false;
  fabric.Object.prototype.controls.tr.visible = false;
  fabric.Object.prototype.controls.tl.visible = false;
  fabric.Object.prototype.controls.bl.visible = false;
  fabric.Object.prototype.controls.ml.visible = false;
  fabric.Object.prototype.controls.mr.visible = false;
  fabric.Object.prototype.controls.mt.visible = false;
  fabric.Object.prototype.controls.mb.visible = false;
  fabric.Object.prototype.controls.br.visible = false;

  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: 0,
    offsetX: 0,
    cursorStyle: "pointer",
    withConnection: true,
    actionName: "remove",
    mouseUpHandler: deleteObject,
    render: generateIconImage(deleteIcon),
  });

  fabric.Object.prototype.controls.cloneControl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: 0,
    offsetX: 0,
    cursorStyle: "pointer",
    withConnection: true,
    actionName: "clone",
    mouseUpHandler: cloneObject,
    render: generateIconImage(cloneIcon),
  });

  fabric.Object.prototype.controls.rotateControl = new fabric.Control({
    x: -0.5,
    y: 0.5,
    offsetY: 0,
    offsetX: 0,
    cursorStyle: `url(${imgCursor}) 12 12, crosshair`,
    withConnection: true,
    actionName: "rotate",
    cursorStyleHandler: rotationStyleHandler,
    // @ts-ignore
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    render: generateIconImage(rotateIcon),
  });

  const objControls = fabric.Object.prototype.controls;
  const originalActionHandler = objControls.br.actionHandler;

  fabric.Object.prototype.controls.resizeIcon = new fabric.Control({
    x: 0.5,
    y: 0.5,
    offsetY: 0,
    offsetX: 0,
    cursorStyle: `nw-resize`,
    actionHandler: originalActionHandler,
    withConnection: true,
    render: generateIconImage(resizeIcon),
  });

}
export function extractFillColorsSelectedObject(obj: fabric.Object | null): IsvgColor[] {
  if (obj == null) return []
  let fillColors: { id: number, value: string }[] = [];
  if (obj?.type == "path") {
    fillColors = [...fillColors, { id: 1, value: obj.fill as string }]
  } else {
    let index: number = 0;
    for (let o of (obj as any)._objects) {
      fillColors = [...fillColors, { id: index, value: o.fill }]
      index++;
    }
  }



  return fillColors;
}





//   function switchImage(
//   eventData: MouseEvent,
//   transform: fabric.Transform & ICanvasImage
// ) {
//   console.log(eventData);
//   const element = (transform.target as any)._element;
//   let canvasObj = transform.target.canvas;
//   let activeObj = canvasObj?.getActiveObject() as any;
//   const listImage = (transform.target as any).list;
//   const currentImageUrl = element.currentSrc;
//   const listImageSize = listImage.length;
//   const currentImageIndex = listImage?.findIndex((image: ISingleImage) => {
//     return image.url === currentImageUrl;
//   });

//   if (currentImageIndex !== -1) {
//     let newIndex = 0;
//     if (currentImageIndex < listImageSize - 1) newIndex = currentImageIndex + 1;
//     activeObj.setSrc(listImage[newIndex].url, () => {
//       canvasObj?.renderAll();
//     });
//   }

//   return true;
// }

