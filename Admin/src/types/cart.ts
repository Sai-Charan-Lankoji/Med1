export interface IApparel {
    side: string;
    url: string;
    color: string;
    width: number;
    height: number;
    selected: boolean;
  }
  
  export interface IBgcolor {
    name: string;
    value: string;
    selected: boolean;
  }
  
  export interface IsvgColor {
    id: number;
    value: string;
  }
  
  export enum DesignEnums {
    "svg",
    "image",
    "text",
    "design",
  }
  
  export interface IProps {
    opacity?: number;
    fill?: string;
    underline?: boolean;
    overline?: boolean;
    backgroundColor?: string;
    borderColor?: string;
    fontSize?: number;
    lineHeight?: number;
    charSpacing?: number;
    fontWeight?: string;
    fontStyle?: "" | "normal" | "italic";
    textAlign?: string;
    fontFamily?: string;
    textDecoration?: string;
    drawMode?: boolean;
    linethrough?: boolean;
    bgColor?: string;
    fillcolor?: string;
  }
  
  export type PropsAction = { type: "SELECTED_PROPS"; payload: IProps };
  export interface IItem {
    id?: string;
    designItem?: DesignEnums;
  }
  
  export interface Item extends IItem {
    url?: string;
    designurl?: string;
    Props?: IProps;
    uploadImageUrl?: string;
    uploadedImageBlob?: any;
    uploadedDesignBlob?: any;
    isNew?: boolean;
  }
  
  export interface IDesign {
    // side: any;
    apparel: IApparel;
    id?: any;
    items: Item[];
    pngImage: any;
    isactive: boolean;
    jsonDesign: any;
    svgImage: any;
    uploadedImages?: string[];
    textProps?: IProps;
  }
  
 
  
 
  export interface ICartItem {
    designs: any[];  // Ideally, define a more specific type here
    designState: IDesign[];
    propsState: IProps;
    price: number;
    quantity: number;
    email: string;
    customer_id: string;
    [key: string]: any;  // Allows for additional optional fields
  }
  
   