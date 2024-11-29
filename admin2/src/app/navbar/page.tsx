"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BellAlert, QuestionMarkCircle } from "@medusajs/icons";
import { Button, Drawer, Input } from "@medusajs/ui";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  // const { contactName } = useAuth() || { contactName: "" };
  // const router = useRouter();

  return (
    <nav className="flex  justify-between items-center p-4 bg-slate-100 text-black h-16  shadow-md border-b border-gray-300">
      <div className="flex items-center space-x-4">
         
      </div>

      <div className="flex items-center space-x-4">
        

        <Drawer>
          <Drawer.Trigger asChild>
            <button
           
              className="text-black/100 hover:text-black transition-colors"
            >
              <BellAlert className="w-6 h-6" />
            </button>
          </Drawer.Trigger>
          <Drawer.Content className="bg-gradient-to-br from-blue-100 via-purple-100 to-blue-100 text-black">
            <Drawer.Header>
              <Drawer.Title className="text-2xl font-bold text-black">Notifications</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-6">
              <p className="text-black">You have no new notifications.</p>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>

        
      </div>
    </nav>
  );
};

export default Navbar;

