"use client";
import React, { useState, useMemo } from "react";
import { Container } from "@medusajs/ui";
import { BackButton } from "@/app/utils/backButton";
import Pagination from "../../../utils/pagination";
import { XMark } from "@medusajs/icons";
import withAuth from "@/lib/withAuth";
import { currencies } from "@/app/utils/currencies ";

const CurrencyManager = () => {
  const [defaultCurrency, setDefaultCurrency] = useState<string>("");
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDefaultCurrency(event.target.value);
  };

  const handleSelectCurrency = (currencyCode: string) => {
    setSelectedCurrencies((prev) => {
      if (prev.includes(currencyCode)) {
        return prev.filter((code) => code !== currencyCode);
      }
      return [...prev, currencyCode];
    });
  };

  const handleSaveChanges = () => {
    setIsModalOpen(false);
  };

  const pageSize = 6;

  const currentCurrencies = useMemo(() => {
    const offset = currentPage * pageSize;
    return currencies.currencies.slice(offset, offset + pageSize);
  }, [currentPage, pageSize]);

  return (
    <>
      <BackButton name = "Settings" />
      <div className="flex flex-row justify-evenly">
        <div className="w-8/12">
          <Container className="mb-4 ">
            <div className="flex flex-col justify-start p-2">
              <h1 className="text-2xl font-bold">Currencies</h1>
              <p className="text-gray-500 mb-4">
                Manage the markets that you will operate within.
              </p>
            </div>
          </Container>
          <Container className="mb-4">
            <div className="flex flex-row justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Store Currencies</h2>
                <p className="text-gray-500 mb-4">
                  All the currencies available in your store.
                </p>
              </div>
              <div>
                <button
                  className="mt-4 text-slate-700 text-sm border border-slate-300 p-2 rounded-md hover:bg-slate-100"
                  onClick={openModal}
                >
                  Edit Currencies
                </button>
              </div>
            </div>
            {currencies.currencies.length === 0 && (
              <span>No Currencies</span>
            )}
            <p className="text-gray-500 mb-4 text-sm font-bold">Currency</p>
            <ul className="list-none pl-5">
              {selectedCurrencies.map((code) => {
                const currency = currencies.currencies.find((c) => c.code === code);
                return currency ? (
                  <li
                    key={code}
                    className="text-gray-700 mb-1 flex items-start p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {currency.code.toLocaleUpperCase()} - {currency.name}
                    {defaultCurrency === currency.code && (
                      <span className="ml-2 text-slate-700 text-sm p-1 bg-gray-100 text-bold">Default</span>
                    )}
                  </li>
                ) : null;
              })}
            </ul>
          </Container>
        </div>
        <div className="w-3/12">
          <Container>
            <h2 className="text-xl font-semibold mb-2">
              Store Currencies
            </h2>
            <p className="text-gray-500 mb-4">
              This is the currency your prices are shown in.
            </p>
            <select
              className="border border-gray-300 rounded-md p-2 w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={defaultCurrency}
              onChange={handleCurrencyChange}
            >
              <option value="" disabled>
                Select a currency
              </option>
              {selectedCurrencies.map((code) => {
                const currency = currencies.currencies.find((c) => c.code === code);
                return currency ? (
                  <option key={code} value={currency.code}>
                    {currency.code.toLocaleUpperCase()} - {currency.name}
                  </option>
                ) : null;
              })}
            </select>
          </Container>
        </div>
        {isModalOpen && (
          <>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-60 z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-6 max-w-lg w-full max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Select Currencies
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={closeModal}
                  >
                    <XMark />
                  </button>
                </div>
                <hr className="pb-4" />
                <div className="flex flex-col gap-4">
                  {currentCurrencies.map((currency) => (
                    <React.Fragment key={currency.code}>
                      <label
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCurrencies.includes(currency.code)}
                          onChange={() => handleSelectCurrency(currency.code)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-800 text-sm">
                          {currency.code.toLocaleUpperCase()} - {currency.name}
                        </span>
                      </label>
                      <hr />
                    </React.Fragment>
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalItems={currencies.currencies.length}
                  data={currencies.currencies}
                />
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition duration-150 ease-in-out"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default withAuth(CurrencyManager);
