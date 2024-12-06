'use client'

import { ArrowLongLeft, CogSixTooth, EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons";
import { Container, DropdownMenu, Heading, IconButton } from "@medusajs/ui";
import React from "react"; 
import {useRouter} from "next/navigation"; 
import withAuth from "@/lib/withAuth";

const Taxes = () => { 
    const router = useRouter();
  return (
    <div>
      <div className="p-4 flex items-center">
  <button className="text-sm text-gray-500 font-semibold flex items-center" onClick={() =>{
    router.back()
  }}>
    <span className="mr-2"><ArrowLongLeft /></span>
    Back to settings
  </button>
</div>

      <Container className="bg-white min-h-screen w-[400px]">
        <div className="flex flex-row justify-between">
          <Heading className="text-[24px] font-semibold mb-2">
          Regions
          </Heading>
          <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onClick={() => router.push("/admin/settings/regions")}>
        <div className="flex flex-row justify-evenly p-2"> 
        <CogSixTooth />
        <Heading className="text-sm">Go to Region settings</Heading>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu>
          </div>
          <p className="text-[12px] text-gray-500">
          Select the region you wish to manage taxes for
          </p>
      </Container>
    </div>
  );
};

export default withAuth(Taxes);
