import { IMenus, MenusAction } from "../@types/models";

export const menuReducer = (menus: IMenus, action: MenusAction): IMenus => {
  switch (action.type) {
    case "TO_DESIGN_MENU":
      return { ...menus, addDesign: !menus.addDesign };
    case "TO_CLIPART_GALLERY":
      return { ...menus, addClippart: action.payload };
    case "TO_SHAPE-GALLERY":
      return { ...menus, addShape: action.payload };
    case "TO_UPLOAD_IMAGE":
      return { ...menus, uploadImage: action.payload };
    case "TO_UPLOAD_DESIGN":
      return { ...menus, uploadDesign: action.payload };
    case "TO_TEXT":
      return { ...menus, addText: action.payload };
    case "SWITCH_TO_CLIPART":
      return {
        ...menus,
        addClippart: action.payload,
        addDesign: action.payload,
        addText: !action.payload,
        uploadImage: !action.payload,
        uploadDesign: !action.payload,
      };
    case "SWITCH_TO_SHAPE":
      return {
        ...menus,
        addShape: action.payload,
        addDesign: action.payload,
        addClippart: !action.payload,
        addText: !action.payload,
        uploadImage: !action.payload,
        uploadDesign: !action.payload,
      };
    case "SWITCH_TO_UPLOAD_IMAGE":
      return {
        ...menus,
        addShape: !action.payload,
        addClippart: !action.payload,
        addDesign: !action.payload,
        addText: !action.payload,
        uploadImage: action.payload,
        uploadDesign: !action.payload,
      };
    case "SWITCH_TO_TEXT":
      return {
        ...menus,
        addShape: !action.payload,
        addClippart: !action.payload,
        addDesign: !action.payload,
        addText: action.payload,
        uploadImage: !action.payload,
        uploadDesign: !action.payload,
      };
    default:
      return menus;
  }
};
