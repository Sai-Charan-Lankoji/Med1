"use client";

import { Inter } from "next/font/google";
import './styles/globals.css';
import NavigationBar from './navbar/page'; // Make sure to use the right path
import Sidebar from "./sidebar/page";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./context/AuthContext";  
import { ThemeProvider } from "@/lib/themeContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement<any> {
  const pathname = usePathname();
  const isVendorPath = pathname.startsWith('/vendor');
  const showNavigation = true; // Show navigation on all pages
  const showSidebar = isVendorPath; // Only show sidebar on vendor paths

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-base-300 text-base-content`}>
        <AuthProvider>
          <ThemeProvider>
            <div className="flex h-screen">
              {showSidebar && <Sidebar />}
              <div className="flex flex-col flex-1">
                {showNavigation && <NavigationBar />}
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}