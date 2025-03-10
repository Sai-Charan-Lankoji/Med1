// app/admin/layout.tsx
import { ReactNode } from "react";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NEXT_URL } from "@/app/constants";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const meResponse = await fetch(`${NEXT_URL}/api/auth/me`, {
    headers: { cookie: cookieHeader || "" },
  });

  if (!meResponse.ok) {
    redirect("/"); // Redirect to login if not authenticated
  }

  const user = await meResponse.json();

  return (
    <div className="flex min-h-screen"> {/* Set full height here */}
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}