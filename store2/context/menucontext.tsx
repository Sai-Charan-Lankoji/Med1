"use client";

import * as React from "react";
import { IMenus, MenusAction } from "../@types/models";
import { menuReducer } from "../reducer/menureducer";

export const MenuContext = React.createContext<{
  menus: IMenus;
  dispatchMenu: React.Dispatch<MenusAction>;
} | null>(null);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [menus, dispatchMenu] = React.useReducer(menuReducer, {
    addDesign:false,
    addClippart: false,
    addShape: false,
    uploadImage: false,
    addText: false,
    uploadDesign: false,
    clipartColorPanel: false,
  });
  console.log(menus);

  return (
    <MenuContext.Provider value={{ menus, dispatchMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
