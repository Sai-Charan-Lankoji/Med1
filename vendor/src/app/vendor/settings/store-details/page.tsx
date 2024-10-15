"use client"
import { BackButton } from "../../../utils/backButton";
import { Container } from "@medusajs/ui";
import React from "react";
// import { useAdminStore } from "medusa-react"; 
import { useRouter } from "next/navigation"; 
import withAuth from "@/lib/withAuth";

const StoreDetails = () => {
  // const { store, isLoading } = useAdminStore(); 
  const router = useRouter()

  return (
    <div>
      <BackButton name = "Settings" />
      <Container className="bg-white w-1/2 ">
        <div className="p-2 mb-4">
          <h1 className="text-2xl font-semibold">Store Details</h1>
          <p className="text-[14px] text-gray-500 font-semibold">
            Manage your business details
          </p>
        </div>
        <hr className="border border-gray-200" />

        <div className="my-4">
          <h1 className="text-gray-700 font-semibold">General</h1>
          <label
            htmlFor="siteName "
            className="text-[12px] text-gray-500  font-semibold"
          >
            Store Name
          </label>
          <input
            type="text"
            // value={store?.name}
            placeholder="Medusa Store"
            className="w-full border border-gray-300 bg-gray-50  px-4 py-2 my-4  rounded-md outline-none hover:border-violet-600 focus:border-violet-600"
            id="siteName"
          />
        </div>

        <div className="my-4  ">
          <h1 className="text-gray-700 font-semibold">Advanced settings</h1>
          <label
            htmlFor="Swap link template "
            className="text-[12px] text-gray-500   font-semibold"
          >
            Swap link template
          </label>
          <input
            type="text"
            placeholder="https://acme.inc/swap={swap_id}"
            className="w-full border border-gray-300 bg-gray-50 px-4 py-2 my-4 rounded-md outline-none  hover:border-violet-600 focus:border-violet-600"
            id="Swap link template"
          />

          <label
            htmlFor="Draft order link template "
            className="text-[12px] text-gray-500   font-semibold"
          >
            Draft order link template
          </label>
          <input
            type="text"
            placeholder="https://acme.inc/payment={payment_id}"
            className="w-full border border-gray-300 bg-gray-50 px-4 py-2  my-4 rounded-md outline-none  hover:border-violet-600 focus:border-violet-600"
            id="Draft order link template"
          />

          <label
            htmlFor="Invite link template
"
            className="text-[12px] text-gray-500   font-semibold"
          >
            Invite link template
          </label>
          <input
            type="text"
            placeholder="https://acme.inc/invite={invite_token}"
            className="w-full border border-gray-300 bg-gray-50 px-4 py-2  my-4 rounded-md outline-none  hover:border-violet-600 focus:border-violet-600"
            id="Invite link template
"
          />
        </div>
        <div className="flex items-center justify-end">
          <button onClick={()=>{
            router.push("/vendor/settings")
          }} className="px-6 py-2 font-semibold bg-white text-black border text-sm border-gray-300 rounded-lg mr-4">
            Cancel
          </button>
          <button className="px-6 py-2 bg-violet-600 text-white text-sm  font-semibold rounded-lg ">
            Save
          </button>
        </div>
      </Container>
    </div>
  );
};

export default withAuth(StoreDetails);
