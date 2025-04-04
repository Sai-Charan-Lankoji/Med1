// src/app/ClientLayout.tsx
'use client';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import { MedusaProvider } from 'medusa-react';
import { QueryClient } from '@tanstack/react-query';
import NavBar from './navbar/page';
import Sidebar from './sidebar/page';
import { usePathname } from 'next/navigation';
import { AuthProvider } from './context/AuthContext';
import { NEXT_URL } from '@/constants';

const inter = Inter({ subsets: ['latin'] });
const queryClient = new QueryClient();

export default function ClientLayout({
  children,
  authData,
}: {
  children: React.ReactNode;
  authData: { email: string; first_name: string; last_name: string; role: string; id: string } | null;
}) {
  const pathname = usePathname();
  const isVendorPath = pathname?.startsWith('/admin');
  const showHeader = isVendorPath && pathname !== '/';
  const showSidebar = isVendorPath && pathname !== '/';

  return (
    <MedusaProvider queryClientProviderProps={{ client: queryClient }} baseUrl={NEXT_URL}>
      <AuthProvider initialAuth={authData}>
        <div className={`${inter.className} flex h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 min-h-screen`}>
          {showSidebar && <Sidebar />}
          <div className="flex flex-col flex-1">
            {showHeader && <NavBar />}
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </AuthProvider>
    </MedusaProvider>
  );
}