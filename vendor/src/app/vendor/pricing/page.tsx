"use client";
import React, { useMemo, useState } from "react";
import { useAdminPriceLists } from "medusa-react";
import { Container, DropdownMenu, IconButton, Input, useToggleState } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import useSearch from "@/app/hooks/useSearch";
import Filter from "../../utils/filter"; 
import withAuth from "@/lib/withAuth";

const PriceLists: React.FC = () => { 
  const [openModal, showModal, closeModal] = useToggleState(false);

   
  return (
    <Container className="bg-white min-h-screen p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Price Lists</h1>

        <div className="flex flex-col sm:flex-row items-center justify-center flex-wrap space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-0">
        <div className="flex flex-row justify-center item-center">
          <Filter count={0} onAddFilter={function (): void {
            throw new Error("Function not implemented.");
          } } label={""}/>
        </div>
          <div className="relative w-full sm:w-auto">
            <Input
              size="small"
              type="search"
              placeholder="Search"
               
            />
          </div>

          <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-white text-[14px] text-gray-700 font-semibold rounded-md hover:bg-gray-100 border border-gray-300 transition">
            <span>Create New</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
         
          <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
            <table className="min-w-full bg-transparent border-collapse">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-300">
                    NAME
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-300">
                    DESCRIPTION
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-300">
                    STATUS
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-300">
                    CUSTOMER GROUPS
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                   <tr   className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-[13px] text-gray-700 border-b border-gray-300">
                     </td>
                    <td className="px-4 py-3 text-[13px] text-gray-700 border-b border-gray-300">
                     </td>
                    <td className="px-4 py-3 text-[13px] text-gray-700 border-b border-gray-300">
                      <span
                        className="w-2.5 h-2.5 rounded-full mr-2 inline-block" 
                      ></span>
                     </td>
                    <td className="px-4 py-3 text-[13px] text-gray-700 border-b border-gray-300">
                       
                    </td>
                    <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b text-end border-gray-300">
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <IconButton
                            variant="transparent"
                            className="rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-300 active:bg-gray-200"
                          >
                            <EllipsisHorizontal className="w-6 h-6 text-gray-500" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content className="bg-white p-4">
                          <DropdownMenu.Label>Actions</DropdownMenu.Label>
                          <DropdownMenu.Item className="bg-white text-gray-500  hover:text-white">
                            <PencilSquare className="mr-2" />
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => {}}
                            className="bg-white text-gray-500  hover:text-white"
                          >
                            <Trash className="mr-2" />
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </td>
                  </tr>
               </tbody>
            </table>
          </div>
      </div>
    </Container>
  );
};

export default  withAuth(PriceLists);
