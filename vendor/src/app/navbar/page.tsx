"use client"; // Ensure client-side rendering
import { useRouter } from "next/navigation";
import React from "react";
import { useAdminDeleteSession } from "medusa-react";
import { BellAlert } from "@medusajs/icons";
import { FaRegBell } from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { Button, Drawer, Input, Label } from "@medusajs/ui";
import { FiSearch } from "react-icons/fi"; 
import { useAuth } from "../context/AuthContext";

const NavBar = () => { 
const { contactName } = useAuth() || { contactName: "" };
  
  return (
    <nav className="flex justify-between p-4 bg-transparent text-gray-500 h-16 ml-62  border-b border-gray-300">
      <div className="flex items-center space-x-4">
       </div>

      <div className="flex justify-center items-center mr-6">
        <Drawer>
          <Drawer.Trigger asChild>
            <button className="m-4 text-xl font-semibold text-black ">
              <FaRegCircleQuestion />
            </button>
          </Drawer.Trigger>
          <Drawer.Content className="bg-white">
            <Drawer.Header>
              <Drawer.Title>SUPPORT FORM</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4 border-none ">
              <div className="flex flex-col m-6">
                <Drawer.Title className="text-2xl">
                  How can we help?
                </Drawer.Title>
                <Drawer.Description className="text-[12px]  ">
                  We usually respond in a few hours
                </Drawer.Description>

                <label
                  htmlFor="help"
                  className="text-[12px] py-4 text-black  font-semibold"
                >
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What is it About"
                  className="text-[13px] pl-4 py-2 border   bg-transparent border-gray-300 rounded-md shadow-sm sm:w-auto focus:border-violet-600 outline-none"
                />

                <label
                  htmlFor="how can we help"
                  className="text-[12px] py-4 font-semibold"
                >
                  How can We help
                </label>
                <textarea
                  rows={6}
                  id="how can we help"
                  placeholder="Write a message"
                  className="text-[13px] pl-4 py-2 border   bg-transparent border-gray-300 rounded-md shadow-sm sm:w-auto focus:border-violet-600 outline-none"
                />
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Button className="w-full bg-violet-600 text-white py-3 hover:bg-violet-500">
                Send Message
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>

        <Drawer>
          <Drawer.Trigger asChild>
            <button className=" text-xl font-semibold text-black pr-4">
              <FaRegBell />
            </button>
          </Drawer.Trigger>
          <Drawer.Content className="bg-white">
            <Drawer.Header>
              <Drawer.Title>Activity</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4 border-none">
  
              <Drawer.Description className="text-[12px]  ">This is where you edit the variant&apos;s details</Drawer.Description>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Drawer.Close>
              <Button>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </div>
    </nav>
  );
};

export default NavBar;
