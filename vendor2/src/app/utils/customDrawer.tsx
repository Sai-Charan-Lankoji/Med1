"use client";
import { useState } from "react";
import { CornerUpLeft, X } from "lucide-react";

const CustomDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div
      className={`fixed top-20 right-0 h-[578px] w-[670px] bg-white shadow-lg z-50 transform ${
        isOpen ? "-translate-x-[468px]" : "translate-x-full"
      } transition-transform duration-300 rounded-lg`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-row items-center">
            <button onClick={onClose} className="btn btn-ghost btn-circle">
              <CornerUpLeft className="h-6 w-6" />
            </button>
            <h2 className="text-[24px] font-semibold text-left px-2">
              Add Custom Item
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form className="flex flex-col grow" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-[14px] font-semibold p-2 text-gray-700">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="E.g. Gift wrapping"
              className="input input-bordered w-full m-2"
            />
          </div>
          <div className="mb-2 grid grid-cols-2 gap-0">
            <div className="flex-1">
              <label className="block text-[14px] font-semibold p-2 text-gray-700">
                Currency
              </label>
              <div className="badge badge-primary m-2">AUD</div>
            </div>
            <div className="flex-1 mt-2">
              <label className="block text-[14px] font-semibold p-2 text-gray-700">
                Price<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="$ 0.00"
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[14px] font-semibold p-2 text-gray-700">
              Quantity<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                placeholder="1"
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="mt-auto flex justify-between gap-4">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomDrawer;