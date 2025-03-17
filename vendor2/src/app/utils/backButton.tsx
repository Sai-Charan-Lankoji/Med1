"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackButton = ({ name }: any) => {
  const router = useRouter();
  
  return (
    <div className="p-4">
      <button
        className="btn btn-outline btn-sm gap-2 text-primary hover:bg-base-200"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowLeft size={16} />
        Back to {name}
      </button>
    </div>
  );
};