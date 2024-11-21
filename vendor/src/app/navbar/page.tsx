"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BellAlert, QuestionMarkCircle } from "@medusajs/icons";
import { Button, Drawer, Input } from "@medusajs/ui";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { contactName } = useAuth() || { contactName: "" };
  const router = useRouter();

  return (
    <nav className="flex  justify-between items-center p-4 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 text-black h-16  shadow-md border-b-2 border-indigo-500">
      <div className="flex items-center space-x-4">
         
      </div>

      <div className="flex items-center space-x-4">
        <Drawer>
          <Drawer.Trigger asChild>
            <button
              className=" transition-colors"
            >
              <QuestionMarkCircle className="w-6 h-6 text-black/100 hover:text-black  " />
            </button>


          </Drawer.Trigger>
          <Drawer.Content className="bg-gradient-to-br from-blue-100 via-purple-100 to-blue-100 text-black">
            <Drawer.Header>
              <Drawer.Title className="text-2xl font-bold text-black">Support</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-black">How can we help?</h3>
              <p className="text-sm text-white-black mb-6">We usually respond in a few hours</p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-black mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What is it about?"
                    className="w-full bg-transparent border border-gray-500 rounded-xl  "
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full p-2 border bg-transparent  border-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-800 transition-all duration-300"
                  />
                </div>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Button className="w-full rounded-xl bg-gradient-to-tr from-indigo-400 via-purple-400 to-blue-400 transition-colors">
                Send Message
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>

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

