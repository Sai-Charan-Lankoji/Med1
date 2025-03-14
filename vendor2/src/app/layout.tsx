"use client";

import { Inter } from "next/font/google";
import './styles/globals.css';
import NavBar from './navbar/page';
import Sidebar from "./sidebar/page";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./context/AuthContext";  

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement<any> {
  const pathname = usePathname();
  const isVendorPath = pathname.startsWith('/vendor');
  const showHeader = isVendorPath;
  const showSidebar = isVendorPath;

  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body className={`${inter.className} bg-gray-100`}>
        <AuthProvider>
          <div className="flex h-screen">
            {showSidebar && <Sidebar />}
            <div className="flex flex-col flex-1">
              {showHeader && <NavBar />}
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
