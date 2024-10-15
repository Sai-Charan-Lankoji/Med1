"use client";
import { PlusMini, XMarkMini } from "@medusajs/icons";
import {
  Button,
  Container,
  FocusModal,
  Heading,
  Toaster,
  useToggleState,
} from "@medusajs/ui";
import { FiSearch } from "react-icons/fi";
import Filter from "../../utils/filter";
import AddDiscountForm from "../components/addDiscounts/page";
import withAuth from "@/lib/withAuth";
import { useState } from "react";

const Discount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <Container className="bg-white  min-h-screen">
      <div className="flex flex-col justify-between sm:flex-row  items-center mb-6">
        <Heading level="h2" className="text-md font-semibold text-gray-700">
          Discounts
        </Heading>
        <Button onClick={openModal} variant="secondary" className="mb-3">
          <PlusMini /> Add Discount
        </Button>
      </div>
      <div className="flex flex-row justify-between items-end space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-0">
        <div className="flex flex-row justify-center item-center">
          <Filter
            count={0}
            onAddFilter={function (): void {
              throw new Error("Function not implemented.");
            }}
            label={""}
          />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by code or description..."
            className="text-[13px] pl-8 p-2 pr-10 border bg-gray-50 border-gray-300 rounded-md shadow-sm focus:border-purple-500 outline-none"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <hr className="mt-4" />
      <table className="min-w-full bg-transparent mt-2">
        <thead className="border-b border-gray-300">
          <tr>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">
              Code
            </th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">
              Description
            </th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 ">
              Amount
            </th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">
              Status
            </th>
            <th className="px-2 py-2 text-end text-xs font-medium text-gray-500">
              Redemptions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100">
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b border-gray-300"></td>
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b border-gray-300">
              {""}
            </td>
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b border-gray-300">
              {""}
            </td>
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b border-gray-300">
              {""}
            </td>
            <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b border-gray-300">
              {""}
            </td>
          </tr>
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-screen w-screen overflow-auto">
            <div className="flex items-center justify-between p-2 border-ui-border-strong border-b">
              <Button onClick={closeModal} variant="secondary">
                <XMarkMini />
              </Button>
              <div className="flex items-center space-x-4">
                <Button variant="secondary" className="px-2 py-2">
                  Save as draft
                </Button>
                <Button className="px-2 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Publish discount
                </Button>
              </div>
            </div>
            <AddDiscountForm />
          </div>
        </div>
      )}
    </Container>
  );
};

export default withAuth(Discount);
