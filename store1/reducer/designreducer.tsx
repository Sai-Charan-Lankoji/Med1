import { IDesign, DesignAction,IProps,PropsAction } from "../@types/models";

export const designReducer = (
  designs: IDesign[],
  action: DesignAction
): IDesign[] => {
 
  switch (action.type) {
   case "ADD_DESIGN": {
  designs = designs.map((a) =>
    a.apparel.url === action.payload.url
      ? { ...a, isactive: true }
      : { ...a, isactive: false }
  );
  const design = designs.find((d) => d.apparel.url === action.payload.url);
  if (!design) {
    designs = [
      ...designs,

      {
        apparel: {
          ...action.payload,
          side: action.payload.side || ' ', 
        },
        id: (designs.length + 1).toString(),
        items: [],
        jsonDesign: null,
        isactive: true,
        pngImage: null,
        svgImage: null,
        uploadedImages: []

      },
    ];
  } else design.isactive = true;

  return designs;
}

    case "UPDATE_DESIGN":
      designs = designs.map((a) =>
        a.apparel.url === action.payload.url
          ? { ...a, isactive: true }
          : { ...a, isactive: false }
      );
      return designs;

      case "CLEAR_ALL": {
        return designs.map(design => ({
          apparel: {
            ...design.apparel,
            color: "#fff", 
          },
          id: design.id,
          items: [],
          jsonDesign: null,
          isactive: design.isactive,
          pngImage: null,
          svgImage: null,
          uploadedImages: [],
        }));
      }
    case "UPDATE_SELECTED_SVG_COLORS":
      designs = designs.map((a) =>
        a.isactive ? { ...a, selectedSvgColors: action.payload } : { ...a }
      );
      return designs;
    case "UPDATE_APPAREL_COLOR":
      designs.forEach((design) => design.apparel.color = action.payload);

      return designs;
    case "ADD_SVG":
      designs.map((a) => (a.isactive ? a.items.push(action.payload) : a));
      return designs;
    case "ADD_UPLOAD_DESIGN": {
      return designs;
    }
    case "UPLOADED_IMAGE": {
      designs.map((a) =>
        a.isactive ? a.uploadedImages?.push(action.payload) : a
      );
      designs = designs.map((a) => (a.isactive ? { ...a, active: true } : a));

      return designs;
    }
    case "UPLOADED_DESIGNS":
      designs = action.payload;

      return designs;
    case "STORE_DESIGN": {
      designs = designs.map((a) =>
        a.isactive
          ? {
              ...a,
              jsonDesign: action.jsonDesign,
              pngImage: action.pngImage,
              svgImage: action.svgImage,
            }
          : a
      );
      const selectedDesign = designs.find(
        (d) => d.apparel.url === action.selectedApparal.url
      );
      if (!selectedDesign) {
        designs = [
          ...designs,
          {
            apparel: {
              ...action.selectedApparal,
            },
            id: (designs.length + 1).toString(),
            items: [],
            jsonDesign: null,
            isactive: true,
            pngImage: null,
            svgImage: null,
            uploadedImages: [],
           
          },
        ];
      }
      designs = designs.map((a) =>
        a.apparel.url === action.selectedApparal.url
          ? { ...a, isactive: true }
          : { ...a, isactive: false }
      );
      return designs;
    }
  case "SWITCH_DESIGN": {
      designs = designs.map((a) =>
        a.id === action.currentDesign?.id
          ? { ...a, isactive: true }
          : { ...a, isactive: false }
      );
      return designs;
    }
    case "DOWNLOAD_DESIGN":
      designs = designs.map((a) =>
        a.isactive ? { ...a, jsonDesign: action.jsonDesign } : a
      );

      return designs;

    case "CLEAR_ITEM": {
      return designs;
    }

    case "TEXT_PROPS":{
      return designs.map((d) => d.isactive ? {...d, textProps: action.payload} : d);
    }
    case "UPDATE_DESIGN_FROM_CART_ITEM": {
      designs = designs.map((a) =>
        a.id === action.currentDesign?.id
          ? { ...a, isactive: true }
          : { ...a, isactive: false }
      );
      return designs;
    }
    default:
      return designs;
  }
};



export const propsReducer = (
  props: IProps,
  action: PropsAction
): IProps => {

  switch (action.type) {
    case "SELECTED_PROPS" :{
      return action.payload;
     
    }
  }
}