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
    credentials: "include",
  }); 

  // Check if the response is ok (status 200)


  // Parse response once
  const user = await meResponse.json();
  console.log("user:", user, "cookie:", cookieHeader);

  // Check if response is successful (status 200) and user exists
  if (!meResponse.ok || !user || user.error) {
    console.log("Redirecting to / due to auth failure");
    redirect("/");
  }

  // Log for debugging
  console.log("meResponse:", user);
  console.log("meResponse status:", meResponse.status, "cookie:", cookieHeader);

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}