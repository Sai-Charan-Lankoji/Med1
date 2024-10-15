"use client";

import { useAuth } from "@/app/context/AuthContext";
import { BackButton } from "@/app/utils/backButton";
import { getColors } from "@/app/utils/dummyData";
import { LanguageSelect } from "@/app/utils/languageSelect";
import { XMarkMini } from "@medusajs/icons";
import {
  Button,
  Container,
  Heading,
  IconButton,
  Input,
  Label,
} from "@medusajs/ui";
import React, { useState } from "react"; 
import withAuth from "@/lib/withAuth";

const PersonalInformation = () => {
  const { email } = useAuth() ?? { email: "Default Email" };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const openModal2 = () => setIsModalOpen2(true);
  const closeModal2 = () => setIsModalOpen2(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isToggledSwitch1, setIsToggledSwitch1] = useState(false);
  const [isToggledSwitch2, setIsToggledSwitch2] = useState(false);

  if (!email) {
    return (
    <div className="flex justify-center items-center min-h-screen">
    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
    )
  
  }

  return (
    <div>
      <BackButton name = "Settings" />
      <Container className="bg-white w-1/2 ">
        <div className="p-2 mb-4">
          <h1 className="text-2xl font-semibold">Personal Information</h1>
          <p className="text-[14px] text-gray-500 font-semibold">
            Manage your Medusa profile...
          </p>
        </div>
        <hr className="border border-gray-200" />

        <div className="my-8 p-2 flex items-center ">
          <div
            className={`w-16 h-16 flex text-4xl items-center justify-center rounded-full text-white
                ${getColors(1)}`}
          >
            {email.charAt(0)}
          </div>
          <h1 className="text-[14px] font-semibold text-gray-700 ml-4">
            {email}
          </h1>

          <button
            onClick={openModal}
            className=" ml-auto text-[14px]  px-4 py-1 rounded-md bg-white border text-gray-700 hover:bg-slate-200 border-gray-300"
          >
            Edit Information
          </button>
        </div>
        <hr className="border border-gray-200" />

        <div className="my-8 p-2 flex items-center ">
          <div className="">
            <h1 className="text-[14px] font-semibold text-gray-700 ml-4">
              Language
            </h1>
            <p className="text-[12px] mt-2 text-gray-500 font-semibold ml-5">
              Adjust the language of Medusa Admin
            </p>
          </div>
          <div className="ml-auto">
            <LanguageSelect />
          </div>
        </div>
        <hr className="border border-gray-200" />

        <div className="my-8 p-2 flex items-center ">
          <div className="flex flex-col">
            <h1 className="text-[14px] font-semibold text-gray-700 ml-4">
              Usage insights
            </h1>
            <p className="text-[12px] mt-2 text-gray-500 font-semibold ml-5">
              Share usage insights and help us improve Medusa
            </p>
          </div>

          <button
            onClick={openModal2}
            className="ml-auto text-[14px]  px-4 py-1 rounded-md bg-white border text-gray-700 hover:bg-slate-200 border-gray-300"
          >
            Edit preferences
          </button>
        </div>
        <hr className="border border-gray-200" />
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 h-[250px] w-[600px]">
              <div className="flex flex-row justify-between">
                <Heading level="h2" className="text-xl font-semibold mb-4">
                  Edit information
                </Heading>
                <IconButton variant="transparent">
                  <XMarkMini onClick={closeModal} />
                </IconButton>
              </div>
              <hr />
              <form>
                <div className="grid grid-cols-2 gap-2 mb-4 mt-6">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">
                      First name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="First name..."
                      className="mt-1 py-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">
                      Last name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Last name..."
                      className="mt-1 py-4 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
                    />
                  </div>
                </div>
                <hr />
                <div className="flex justify-end pt-4 ">
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="transparent"
                    className="ml-2 px-8 py-2 border-none rounded-md outline-none text-white font-bold font-cabin bg-violet-600 hover:bg-violet-500"
                  >
                    Submit and close
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isModalOpen2 && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 h-[350px] w-[700px]">
              <div className="flex flex-row justify-between">
                <Heading level="h2" className="text-xl font-semibold mb-4">
                  Edit preferences
                </Heading>
                <IconButton variant="transparent">
                  <XMarkMini onClick={closeModal2} />
                </IconButton>
              </div>
              <hr />
              <form>
                <div className="flex items-center space-x-4 p-4">
                  <div className="flex flex-col">
                    <Heading level="h3">Anonymize my usage data</Heading>
                    <p className="text-[14px] text-gray-500 font-cabin pt-2">
                      You can choose to anonymize your usage data. If this
                      option is selected, we will not collect your personal
                      information, such as your name and email address.
                    </p>
                  </div>
                  <div
                    className={`relative inline-flex items-center h-6 w-20 transition-colors duration-300 ease-in-out ${
                      isToggledSwitch1 ? "bg-violet-500" : "bg-gray-300"
                    } rounded-full cursor-pointer`}
                    onClick={() => setIsToggledSwitch1(!isToggledSwitch1)}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                        isToggledSwitch1 ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4">
                  <div className="flex flex-col">
                    <Heading level="h3">
                      Opt out of sharing my usage data
                    </Heading>
                    <p className="text-[14px] text-gray-500 font-cabin pt-2">
                      You can always opt out of sharing your usage data at any
                      time.
                    </p>
                  </div>
                  <div
                    className={`relative inline-flex items-center h-6 w-10 transition-colors duration-300 ease-in-out ${
                      isToggledSwitch2 ? "bg-violet-500" : "bg-gray-300"
                    } rounded-full cursor-pointer`}
                    onClick={() => setIsToggledSwitch2(!isToggledSwitch2)}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                        isToggledSwitch2 ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
                <hr />
                <div className="flex justify-end pt-4 ">
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    variant="transparent"
                    className="ml-2 px-8 py-2 border-none rounded-md outline-none text-white font-bold font-cabin bg-violet-600 hover:bg-violet-500"
                  >
                    Submit and close
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default withAuth(PersonalInformation);
