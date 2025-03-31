'use client';
import { Inter } from "next/font/google";
import "../public/globals.css";
import Navbar from "./navbar/page";
import React from "react";
import { UserProvider } from "@/context/userContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MedusaProvider } from "medusa-react";
import { SvgProvider } from "@/context/svgcontext";
import { store } from "../reducer/store";
import { Provider } from "react-redux";
import { LoadingProvider } from "./loadingProvider";
import { StoreProvider } from "@/context/storecontext";
import { WishlistProvider } from "@/context/wishlistContext";

const queryClient = new QueryClient();
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              {/* <MedusaProvider
                queryClientProviderProps={{ client: queryClient }}
                baseUrl=`${NEXT_PUBLIC_API_URL}`
                publishableApiKey={process.env.NEXT_PUBLIC_MEDUSA_API_KEY}
              > */}
                <WishlistProvider>
                <StoreProvider> 
                  <UserProvider>
                    <SvgProvider>
                      <main className="min-h-screen">
                        <Navbar />
                        <div className="pt-18 px-2 sm:px-6 lg:px-0 max-w-8xl mx-auto">
                          {children}
                        </div>
                      </main>
                    </SvgProvider>
                  </UserProvider>
                </StoreProvider>
                </WishlistProvider>
              {/* </MedusaProvider> */}
            </QueryClientProvider>
          </Provider>
        </LoadingProvider>
      </body>
    </html>
  );
}
