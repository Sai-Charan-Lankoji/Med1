"use client";
import { PlusMini, XMarkMini } from "@medusajs/icons";
import withAuth from "@/lib/withAuth";
import { Button, Container, Heading, IconButton, Input } from "@medusajs/ui";
import { useMemo, useState } from "react";
// import { useAdminGiftCards } from "medusa-react";
import useSearch from "@/app/hooks/useSearch";
import CreateGiftCardForm from "../form-components/createGiftCard/page";
import CustomGiftCardForm from "../form-components/customGiftCard/page";

const GiftCards = () => {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // const { gift_cards, isLoading } = useAdminGiftCards();
  const [currentPage, setCurrentPage] = useState(0);

  const openCustomModal = () => setIsCustomModalOpen(true);
  const closeCustomModal = () => setIsCustomModalOpen(false);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const pageSize = 6;

  const { searchQuery, setSearchQuery, filteredData } = useSearch({
    data: [],
    searchKeys: ["code"],
  });

  const currentGiftCards = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, filteredData.length);
    return filteredData.slice(offset, limit);
  }, [currentPage, pageSize, filteredData]);

  return (
    <>
      <Heading className="text-4xl font-cabin text-gray-950 ml-2 p-1">
        Gift Cards
      </Heading>
      <p className="text-gray-500 text-[15px] font-cabin ml-2 p-2">
        Manage the Gift Cards of your Medusa store
      </p>
      <Container className="m-2">
        <Heading level="h2">
          Are you ready to sell your first Gift Card?
        </Heading>
        <p className="text-gray-500 text-[12px] font-cabin pt-2 pb-4">
          No Gift Card has been added yet.
        </p>
        <Button
          variant="transparent"
          className="text-purple-600 hover:bg-inherit"
          onClick={openCreateModal}
        >
          Create Gift Card
        </Button>
      </Container>
      <Container className="bg-white  min-h-screen m-2">
        <div className="flex flex-col justify-between sm:flex-row  items-center mb-6">
          <div className="flex flex-col justify-center">
            <Heading className="text-2xl font-semibold text-gray-950">
              History
            </Heading>
            <p className="text-gray-500 text-[12px] font-cabin pt-2">
              See the history of purchased Gift Cards
            </p>
          </div>
          <Button
            variant="secondary"
            className="mb-3 border  text-sm"
            onClick={openCustomModal}
          >
            <PlusMini /> Custom Gift Card
          </Button>
        </div>
        <div className="flex flex-row justify-end items-end space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-0">
          <div className="relative">
            <Input
              size="small"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                Order
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 ">
                Original Amount
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">
                Balance
              </th>
              <th className="px-2 py-2 text-end text-xs font-medium text-gray-500">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {currentGiftCards &&
              currentGiftCards.map((gift_card) => (
                <tr key={""} className="hover:bg-gray-100">
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
                  <td className="px-4 py-[13px] text-[12px] text-gray-500 border-b border-gray-300">
                    {""}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Container>
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-auto w-[600px]">
            <div className="flex flex-row justify-between">
              <Heading level="h2" className="text-xl font-semibold mb-4">
                Create Gift Card
              </Heading>
              <IconButton variant="transparent">
                <XMarkMini onClick={closeCreateModal} />
              </IconButton>
            </div>
            <CreateGiftCardForm />
          </div>
        </div>
      )}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-auto w-[600px]">
            <div className="flex flex-row justify-between">
              <Heading level="h2" className="text-xl font-semibold mb-4">
                Custom Gift Card
              </Heading>
              <IconButton variant="transparent">
                <XMarkMini onClick={closeCustomModal} />
              </IconButton>
            </div>
            <CustomGiftCardForm />
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(GiftCards);
