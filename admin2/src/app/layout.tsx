"use client";

import { Inter } from "next/font/google";
import './styles/globals.css';
import { MedusaProvider } from "medusa-react";
import { QueryClient } from "@tanstack/react-query";
import NavBar from './navbar/page';
import Sidebar from "./sidebar/page";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./context/AuthContext"; 


const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function  RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  const pathname = usePathname();
  const isVendorpath = pathname.startsWith('/vendor') ;
  const showHeader = isVendorpath;
  const showSidebar = isVendorpath;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-100`}>
        <MedusaProvider
          queryClientProviderProps={{ client: queryClient }}
          baseUrl="http://localhost:9000"
        >
          <AuthProvider>
   

          <div className="flex h-screen">
            {showSidebar && <Sidebar />}
            <div className="flex flex-col flex-1">
              {showHeader && <NavBar />}
              <main className="flex-1   overflow-auto">

                {children}
              </main>
            </div>
          </div>
          </AuthProvider>
        </MedusaProvider>
      </body>
    </html>
  );
}
