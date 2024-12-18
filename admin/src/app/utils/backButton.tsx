"use client";
import { ArrowLongLeft } from "@medusajs/icons";
import { useRouter } from "next/navigation";

export const BackButton = ({name}: any) => {
  const router = useRouter();
  return (
    <div className="p-4 flex items-center  ">
      <button
        className="text-sm border border-gray-300 p-2 rounded-md hover:bg-gray-200  text-indigo-600 hover:text-indigo-800 transition-colors  font-semibold flex items-center"
        onClick={() => {
          router.back();
        }}
      >
        <span className="mr-2">
          <ArrowLongLeft />
        </span>
        Back to {name}
      </button>
    </div>
  );
};
