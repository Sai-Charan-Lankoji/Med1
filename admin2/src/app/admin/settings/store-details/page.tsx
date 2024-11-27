"use client";
import { BackButton } from "../../../utils/backButton";
import { Button, Container, Input, Label } from "@medusajs/ui";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/lib/withAuth";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { Francois_One } from "next/font/google";

const StoreDetails = () => {
  const { data: stores } = useGetStores();
  console.log("Stores: ", stores);
  const [formData, setFormData] = useState({
    storeName: "",
    swapLinkTemplate: "",
    paymentLinkTemplate: "",
    inviteLinkTemplate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const router = useRouter();

  return (
    <div>
      <BackButton name="Settings" />
      <Container className="bg-white w-1/2 ">
        <div className="p-2 mb-4">
          <h1 className="text-2xl font-semibold">Store Details</h1>
          <p className="text-[14px] text-gray-500 font-semibold">
            Manage your business details
          </p>
        </div>
        <hr className="border border-gray-200" />
        <form>
        {stores?.map((store) => (
          <>
        <div className="my-4">
          <h1 className="text-gray-700 font-semibold">General</h1>
          <Label
            htmlFor="siteName "
            className="text-[12px] text-gray-500  font-semibold"
          >
            Store Name
          </Label>
          <Input
            type="text"
            name="storeName"  
            value={formData.storeName || store.name}  
            onChange={handleChange}    
            placeholder="Medusa Store"
            className="w-full border border-gray-300 bg-gray-50  px-4 py-2 my-4  rounded-md outline-none hover:border-violet-600 focus:border-violet-600"
            id="siteName"
          />
        </div>

        <div className="my-4  ">
          <h1 className="text-gray-700 font-semibold">Advanced settings</h1>
          <Label
            htmlFor="Swap link template "
            className="text-[12px] text-gray-500   font-semibold"
          >
            Swap link template
          </Label>
          <Input
            type="text"
            name="swapLinkTemplate"  
            value={formData.swapLinkTemplate || store.swap_link_template}  
            onChange={handleChange}    
            placeholder="https://acme.inc/swap={swap_id}"
            className="w-full border border-gray-300 bg-gray-50 px-4 py-2 my-4 rounded-md outline-none  hover:border-violet-600 focus:border-violet-600"
            id="Swap link template"
          />

          <Label
            htmlFor="Draft order link template "
            className="text-[12px] text-gray-500   font-semibold"
          >
            Draft order link template
          </Label>
          <Input
            type="text"
            name="paymentLinkTemplate"  
            value={formData.paymentLinkTemplate || store.payment_link_template}  
            onChange={handleChange}    
            placeholder="https://acme.inc/payment={payment_id}"
            className="w-full border border-gray-300 bg-gray-50 px-4 py-2  my-4 rounded-md outline-none  hover:border-violet-600 focus:border-violet-600"
            id="Draft order link template"
          />

          <Label
            htmlFor="Invite link template
"
            className="text-[12px] text-gray-500   font-semibold"
          >
            Invite link template
          </Label>
          <Input
            type="text"
            name="inviteLinkTemplate"  
            value={formData.inviteLinkTemplate || store.invite_link_template}  
            onChange={handleChange}  
            placeholder="https://acme.inc/invite={invite_token}"
            className="w-full border border-gray-300 bg-gray-50 px-4 py-2  my-4 rounded-md outline-none  hover:border-violet-600 focus:border-violet-600"
            id="Invite link template
"
          />
        </div>
        </>
        ))}
        </form>
        <div className="flex items-center justify-end">
          <Button
            onClick={() => {
              router.push("/vendor/settings");
            }}
            variant="secondary"
            className="px-6 py-2 font-semibold bg-white text-black border text-sm border-gray-300 rounded-lg mr-4"
          >
            Cancel
          </Button>
          <Button variant="secondary" className="px-6 py-2 bg-violet-600 text-white text-sm  font-semibold rounded-lg ">
            Save
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default withAuth(StoreDetails);
