import { ReactNode } from "react";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import { redirect } from "next/navigation";
import { NEXT_URL } from "@/app/constants";

// Client-side component to fetch user
async function fetchUser(token: string) {
  const response = await fetch(`${NEXT_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // This runs server-side, so we can't access localStorage here
  // Instead, we'll handle auth client-side or assume token is passed somehow
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value; // Fallback if cookie is set

  if (!token) {
    console.log("No token found, redirecting to /");
    redirect("/"); // Redirect if no token (server-side)
  }

  const user = await fetchUser(token);

  console.log("meResponse:", user);
  console.log("meResponse status:", user ? 200 : 401, "token:", token);

  if (!user || user.success === false) {
    console.log("Redirecting to / due to auth failure");
    redirect("/");
  }

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

import { cookies as nextCookies } from "next/headers";

function cookies() {
  return nextCookies();
}
