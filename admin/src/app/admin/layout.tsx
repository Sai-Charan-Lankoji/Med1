"use client";

import { ReactNode, useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { NEXT_URL } from "@/app/constants";

async function fetchUser(token: string) {
  const response = await fetch(`${NEXT_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return { data: await response.json(), status: response.status };
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token") || "";

    if (!token) {
      console.log("No token found, redirecting to /");
      router.push("/");
      return;
    }

    async function checkAuth() {
      const { data, status } = await fetchUser(token as string);
      console.log("meResponse:", data);
      console.log("meResponse status:", status, "token:", token);

      if (!data || data.success === false || status !== 200) {
        console.log("Redirecting to / due to auth failure");
        router.push("/");
      } else {
        setUser(data);
      }
    }

    checkAuth();
  }, [router]);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen"> {/* Changed min-h-screen to h-screen */}
      <div className="fixed h-screen w-64 flex-shrink-0"> {/* Fixed Sidebar */}
        <Sidebar user={user} />
      </div>
      <div className="flex-1 flex flex-col ml-64 overflow-y-auto"> {/* Scrollable content with offset */}
        <div className="sticky top-0 z-10"> {/* Sticky Navbar */}
          <Navbar />
        </div>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}