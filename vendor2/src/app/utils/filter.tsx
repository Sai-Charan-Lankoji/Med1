"use client";

import { Plus } from "lucide-react";
import React from "react";

interface FilterProps {
  count: number;
  onAddFilter?: () => void; // Made optional since it's not used in the original
  label?: string; // Made optional since it's not used in the original
  badgeColor?: string; // Kept optional, though unused in this version
}

const Filter: React.FC<FilterProps> = ({ count }) => {
  return (
    <div className="flex flex-row justify-center items-center">
      <span className="badge badge-neutral text-xs font-semibold mr-2 px-2 py-3">
        Filters <span className="text-purple-500">{count}</span>
      </span>
      <button className="btn btn-ghost btn-circle btn-xs">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Filter;