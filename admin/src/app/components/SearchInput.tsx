// components/SearchInput.tsx
"use client";

import { FaSearch } from "react-icons/fa";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input input-bordered w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}