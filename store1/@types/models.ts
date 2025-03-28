// Design-related interfaces (used by canvasReducer and designable products)
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
  svg = "svg",
  image = "image",
  text = "text",
  design = "design",
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

export interface Item {
  id?: string;
  designItem?: DesignEnums;
  url?: string;
  designurl?: string;
  Props?: IProps;
  uploadImageUrl?: string;
  uploadedImageBlob?: any;
  uploadedDesignBlob?: any;
  isNew?: boolean;
}
export type PropsAction = { type: "SELECTED_PROPS"; payload: IProps };

export interface IDesign {
  apparel: IApparel;
  id?: string; // Changed from `any` for better typing
  items: Item[];
  pngImage: any; // Consider specifying type if possible (e.g., string for URL)
  isactive: boolean;
  jsonDesign?: any; // Consider specifying type if known
  svgImage: any; // Consider specifying type if known
  uploadedImages: string[];
  textProps?: IProps;
}
export interface Address {
  id: string;
  customer_id: string;
  customer_email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  metadata?: any;
}

export type PasswordFieldProps = {
  control: any;
  name: string;
  label: string;
  show: boolean;
  onToggle: () => void;
  error?: string;
};

// FormField and PasswordField components remain unchanged
export interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  type?: string;
  error?: string;
}

export interface OrderData {
  line_items: Array<{
    product_id: string | undefined;
    quantity: number;
    price: number;
    title: string;
    images: string[];
    designs?: IDesignableCartItem["designs"];
    selected_size?: IStandardCartItem["selected_size"];
    selected_color?: IStandardCartItem["selected_color"];
    selected_variant?: IStandardCartItem["selected_variant"];
    product_type?: "designable" | "standard";
  }>;
  total_amount: number;
  currency_code: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  customer_id: string | null;
  email: string | null;
  region_id: string;
  vendor_id: string | null;
  public_api_key: string | null;
  store_id: string | null;
  shipping_charges: number;
  hsn_tax_details: Array<{
    hsn_code: string;
    tax_percentage: number;
    taxable_amount: number;
    tax_amount: number;
  }>;

  shipping_address?: Address;
  billing_address?: Address;
  payment_method?: string;
}

// Cart-related interfaces
export interface IDesignableCartItem {
  product_type: "designable";
  id: string;
  hsnCode: string;
  product_id: string;
  gstPercentage: number;
  designs: IDesign[];
  designState: IDesign[] | null;
  propsState: IProps | null;
  quantity: number;
  weightInGrams: number;
  price: number;
  total_price: number;
  customer_id: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IStandardCartItem {
  product_type: "standard";
  id: string;
  product_id: string;
  hsnCode: string;
  gstPercentage: number;
  selected_size: string | null;
  selected_color: string | null;
  selected_variant: string | null;
  quantity: number;
  price: number;
  weightInGrams: number;
  total_price: number;
  customer_id: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product_details?: {
    id: string;
    title: string;
    description: string;
    price: number;
    brand: string;
    sizes: string[];
    colors: { hex: string; name: string }[];
    front_image: string;
    back_image: string;
    left_image: string;
    right_image: string;
    category: string;
    sku: string;
    sale: boolean;
    customizable: boolean;
  };
}

export type ICartItem = IDesignableCartItem | IStandardCartItem;

export interface ICartState {
  designable: IDesignableCartItem[];
  standard: IStandardCartItem[];
  loading: boolean;
  error: string | null;
}

// Action types for canvasReducer (designable products)
export type DesignAction =
  | { type: "ADD_DESIGN"; payload: IApparel }
  | { type: "UPDATE_DESIGN"; payload: IApparel }
  | { type: "ADD_SVG"; payload: Item }
  | { type: "DELETE_SVG"; payload: Item }
  | { type: "ADD_TEST"; payload: Item } // Consider renaming to ADD_TEXT if it’s for text
  | { type: "DELETE_TEST"; payload: Item }
  | { type: "ADD_UPLOAD_DESIGN"; payload: Item }
  | { type: "DELETE_UPLOAD_DESIGN"; payload: Item }
  | { type: "ADD_UPLOAD_IAMGE"; payload: Item } // Typo: should be ADD_UPLOAD_IMAGE
  | { type: "DELETE_UPLOAD_IAMGE"; payload: Item } // Typo: should be DELETE_UPLOAD_IMAGE
  | { type: "UPDATE_SELECTED_SVG_COLORS"; payload: IsvgColor[] }
  | { type: "UPDATE_APPAREL_COLOR"; payload: string }
  | {
      type: "STORE_DESIGN";
      currentDesign: IDesign;
      selectedApparal: IApparel; // Typo: should be selectedApparel
      jsonDesign: any;
      pngImage: any;
      svgImage: any;
    }
  | { type: "SWITCH_DESIGN"; currentDesign: IDesign | undefined }
  | { type: "DOWNLOAD_DESIGN"; jsonDesign: any }
  | { type: "UPLOADED_IMAGE"; payload: string }
  | { type: "CLEAR_ITEM"; svgId: string; designItemType: string }
  | { type: "UPLOADED_DESIGNS"; payload: IDesign[] }
  | { type: "TEXT_PROPS"; payload: IProps }
  | { type: "UPDATE_DESIGN_FROM_CART_ITEM"; currentDesign: IDesign }
  | { type: "CLEAR_ALL" };

export type ColorPickerAction =
  | { type: "SVG_COLORS"; payload: IsvgColor[] }
  | {
      type: "UPDATE_DESING_COLOR"; // Typo: should be UPDATE_DESIGN_COLOR
      payload: { colors: IsvgColor[]; oldColor: string; newColor: string };
    }
  | {
      type: "UPDATE_SVG_COLOR";
      payload: { oldColor: string; newColor: string };
    };

// UI-related interfaces
export interface IMenus {
  addDesign: boolean;
  addClippart: boolean; // Typo: should be addClipart
  addShape: boolean;
  uploadImage: boolean;
  addText: boolean;
  uploadDesign: boolean;
  clipartColorPanel: boolean;
}

export type MenusAction =
  | { type: "TO_CLIPART_GALLERY"; payload: boolean }
  | { type: "TO_SHAPE-GALLERY"; payload: boolean }
  | { type: "TO_DESIGN_MENU"; payload: boolean }
  | { type: "TO_UPLOAD_IMAGE"; payload: boolean }
  | { type: "TO_TEXT"; payload: boolean }
  | { type: "TO_UPLOAD_DESIGN"; payload: boolean }
  | { type: "SWITCH_TO_CLIPART"; payload: boolean }
  | { type: "SWITCH_TO_SHAPE"; payload: boolean }
  | { type: "SWITCH_TO_TEXT"; payload: boolean; props: IProps }
  | { type: "SWITCH_TO_UPLOAD_IMAGE"; payload: boolean };

// Constants
export const bgColours: IBgcolor[] = [
  { name: "primary", value: "#ffffff", selected: true }, // White
  { name: "primary", value: "#007bff", selected: false }, // Blue
  { name: "secondary", value: "#6c757d", selected: false }, // Gray
  { name: "warning", value: "#ffc107", selected: false }, // Yellow
  { name: "danger", value: "#dc3545", selected: false }, // Red
];

export const designApparels: IApparel[] = [
  {
    url: "https://ik.imagekit.io/zz7harqme/20200311011316304.png?updatedAt=1727375584541",
    side: "front",
    selected: true,
    color: "#ffffff",
    width: 175,
    height: 280,
  },
  {
    url: "https://ik.imagekit.io/zz7harqme/202003110113161604.png?updatedAt=1727375934473",
    side: "back",
    selected: false,
    color: "#ffffff",
    width: 160,
    height: 330,
  },
  {
    url: "https://ik.imagekit.io/zz7harqme/20200311103921748.png?updatedAt=1727375559699",
    side: "leftshoulder",
    selected: false,
    color: "#ffffff",
    width: 130,
    height: 165,
  },
  {
    url: "https://ik.imagekit.io/zz7harqme/202003111039219177.png?updatedAt=1727375961359",
    side: "rightshoulder",
    selected: false,
    color: "#ffffff",
    width: 130,
    height: 160,
  },
];

export const cliparts: { url: string }[] = [
  { url: "images/art1.svg" },
  { url: "images/art2.svg" },
  { url: "images/art4.svg" },
  { url: "images/art5.svg" },
  { url: "images/art8.svg" },
  { url: "images/art9.svg" },
  { url: "images/art10.svg" },
  { url: "images/art11.svg" },
  { url: "images/art12.svg" },
  { url: "images/art13.svg" },
  { url: "images/art14.svg" },
  { url: "images/art15.svg" },
];

// SVG Icons
export const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

export const cloneIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 55.699 55.699' width='100px' height='100px' xml:space='preserve'%3E%3Cpath style='fill:red;' d='M51.51,18.001c-0.006-0.085-0.022-0.167-0.05-0.248c-0.012-0.034-0.02-0.067-0.035-0.1 c-0.049-0.106-0.109-0.206-0.194-0.291v-0.001l0,0c0,0-0.001-0.001-0.001-0.002L34.161,0.293c-0.086-0.087-0.188-0.148-0.295-0.197 c-0.027-0.013-0.057-0.02-0.086-0.03c-0.086-0.029-0.174-0.048-0.265-0.053C33.494,0.011,33.475,0,33.453,0H22.177 c-3.678,0-6.669,2.992-6.669,6.67v1.674h-4.663c-3.678,0-6.67,2.992-6.67,6.67V49.03c0,3.678,2.992,6.669,6.67,6.669h22.677 c3.677,0,6.669-2.991,6.669-6.669v-1.675h4.664c3.678,0,6.669-2.991,6.669-6.669V18.069C51.524,18.045,51.512,18.025,51.51,18.001z M34.454,3.414l13.655,13.655h-8.985c-2.575,0-4.67-2.095-4.67-4.67V3.414z M38.191,49.029c0,2.574-2.095,4.669-4.669,4.669H10.845 c-2.575,0-4.67-2.095-4.67-4.669V15.014c0-2.575,2.095-4.67,4.67-4.67h5.663h4.614v10.399c0,3.678,2.991,6.669,6.668,6.669h10.4 v18.942L38.191,49.029L38.191,49.029z M36.777,25.412h-8.986c-2.574,0-4.668-2.094-4.668-4.669v-8.985L36.777,25.412z M44.855,45.355h-4.664V26.412c0-0.023-0.012-0.044-0.014-0.067c-0.006-0.085-0.021-0.167-0.049-0.249 c-0.012-0.033-0.021-0.066-0.036-0.1c-0.048-0.105-0.109-0.205-0.194-0.29l0,0l0,0c0-0.001-0.001-0.002-0.001-0.002L22.829,8.637 c-0.087-0.086-0.188-0.147-0.295-0.196c-0.029-0.013-0.058-0.021-0.088-0.031c-0.086-0.03-0.172-0.048-0.263-0.053 c-0.021-0.002-0.04-0.013-0.062-0.013h-4.614V6.67c0-2.575,2.095-4.67,4.669-4.67h10.277v10.4c0,3.678,2.992,6.67,6.67,6.67h10.399 v21.616C49.524,43.26,47.429,45.355,44.855,45.355z'/%3E%3C/svg%3E%0A";

export const rotateIcon =
  "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' aria-labelledby='title' aria-describedby='desc' role='img' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3ERotate%3C/title%3E%3Cdesc%3EA solid styled icon from Orion Icon Library.%3C/desc%3E%3Cpath data-name='layer1' d='M60.693 22.023a3 3 0 0 0-4.17.784l-2.476 3.622A27.067 27.067 0 0 0 28 6C13.443 6 2 18.036 2 32.584a26.395 26.395 0 0 0 45.066 18.678 3 3 0 1 0-4.244-4.242A20.395 20.395 0 0 1 8 32.584C8 21.344 16.752 12 28 12a21.045 21.045 0 0 1 20.257 16.059l-4.314-3.968a3 3 0 0 0-4.062 4.418l9.737 8.952c.013.013.03.02.043.033.067.06.143.11.215.163a2.751 2.751 0 0 0 .243.17c.076.046.159.082.24.12a3.023 3.023 0 0 0 .279.123c.08.03.163.05.246.071a3.045 3.045 0 0 0 .323.07c.034.006.065.017.1.022.051.006.102-.002.154.002.063.004.124.017.187.017.c.07 0 .141-.007.212-.012l.08-.004.l.05-.003c.06-.007.118-.03.179-.04a3.119 3.119 0 0 0 .387-.087c.083-.027.16-.064.239-.097a2.899 2.899 0 0 0 .314-.146 2.753 2.753 0 0 0 .233-.151 2.944 2.944 0 0 0 .263-.2c.07-.06.135-.124.199-.19a3.013 3.013 0 0 0 .224-.262c.03-.04.069-.073.097-.114l7.352-10.752a3.001 3.001 0 0 0-.784-4.17z' fill='%23e7493e'%3E%3C/path%3E%3C/svg%3E";

export const imgCursor =
  "data:image/svg+xml;charset=utf-8,%0A%20%20%20%20%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%20width%3D'24'%20height%3D'24'%3E%0A%20%20%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3Cfilter%20id%3D'a'%20width%3D'266.7%25'%20height%3D'156.2%25'%20x%3D'-75%25'%20y%3D'-21.9%25'%20filterUnits%3D'objectBoundingBox'%3E%0A%20%20%20%20%20%20%20%20%20%20%3CfeOffset%20dy%3D'1'%20in%3D'SourceAlpha'%20result%3D'shadowOffsetOuter1'%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%3CfeGaussianBlur%20in%3D'shadowOffsetOuter1'%20result%3D'shadowBlurOuter1'%20stdDeviation%3D'1'%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%3CfeColorMatrix%20in%3D'shadowBlurOuter1'%20result%3D'shadowMatrixOuter1'%20values%3D'0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.2%200'%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%3CfeMerge%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CfeMergeNode%20in%3D'shadowMatrixOuter1'%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CfeMergeNode%20in%3D'SourceGraphic'%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FfeMerge%3E%0A%20%20%20%20%20%20%20%20%3C%2Ffilter%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20id%3D'b'%20d%3D'M1.67%2012.67a7.7%207.7%200%200%200%200-9.34L0%205V0h5L3.24%201.76a9.9%209.9%200%200%201%200%2012.48L5%2016H0v-5l1.67%201.67z'%2F%3E%0A%20%20%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%20%20%3Cg%20fill%3D'none'%20fill-rule%3D'evenodd'%3E%3Cpath%20d%3D'M0%2024V0h24v24z'%2F%3E%0A%20%20%20%20%20%20%20%20%3Cg%20fill-rule%3D'nonzero'%20filter%3D'url(%23a)'%20transform%3D'rotate(-90%209.25%205.25)'%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cuse%20fill%3D'%23e7493e'%20fill-rule%3D'evenodd'%20xlink%3Ahref%3D'%23b'%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cpath%20stroke%3D'%23FFF'%20d%3D'M1.6%2011.9a7.21%207.21%200%200%200%200-7.8L-.5%206.2V-.5h6.7L3.9%201.8a10.4%2010.4%200%200%201%200%2012.4l2.3%202.3H-.5V9.8l2.1%202.1z'%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fsvg%3E";

export const resizeIcon =
  "data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%0A%3C!--%20Uploaded%20to%3A%20SVG%20Repo%2C%20www.svgrepo.com%2C%20Generator%3A%20SVG%20Repo%20Mixer%20Tools%20--%3E%0A%3C!DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0A%3Csvg%20fill%3D%22%23e7493e%22%20height%3D%2210px%22%20width%3D%2210px%22%20version%3D%221.1%22%20id%3D%22Capa_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20%0A%09%20viewBox%3D%220%200%20182.931%20182.931%22%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cpath%20d%3D%22M173.93%2C92.798c-4.971%2C0-9%2C4.029-9%2C9v50.404L30.728%2C18h50.404c4.971%2C0%2C9-4.029%2C9-9s-4.029-9-9-9H9C4.03%2C0%2C0%2C4.029%2C0%2C9%0A%09v72.132c0%2C4.971%2C4.029%2C9%2C9%2C9s9-4.029%2C9-9V30.729l134.202%2C134.202h-50.404c-4.971%2C0-9%2C4.029-9%2C9s4.029%2C9%2C9%2C9h72.132%0A%09c4.971%2C0%2C9-4.029%2C9-9v-72.132C182.93%2C96.828%2C178.901%2C92.798%2C173.93%2C92.798z%22%2F%3E%0A%3C%2Fsvg%3E";

export const triangleIconFill =
  "data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%22450%22%20width%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cpolygon%20points%3D%22200%2C50%20400%2C400%2050%2C400%22%20style%3D%22fill%3Ablack%3Bstroke%3Apurple%3Bstroke-width%3A3%22%20%2F%3E%0A%20%20Sorry%2C%20your%20browser%20does%20not%20support%20inline%20SVG.%0A%3C%2Fsvg%3E";

export const triangleIcon =
  "data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%22500px%22%20width%3D%22500px%22%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%20xml%3Aspace%3D%22preserve%22%3E%0A%20%20%3Cpolygon%20points%3D%22250%2C0%20500%2C350%200%2C350%22%20style%3D%22fill%3Atransparent%3Bstroke%3Ablack%3Bstroke-width%3A7%22%20%2F%3E%0A%20%20SVG%20Triangle%0A%3C%2Fsvg%3E";
