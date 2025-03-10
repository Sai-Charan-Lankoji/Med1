// components/BackButton.tsx
"use client"; // Client component for navigation

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton({ href = "/admin/vendors" }: { href?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="btn btn-outline btn-primary btn-sm flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
    >
      <FaArrowLeft className="text-lg" />
      Back to Vendors
    </button>
  );
}