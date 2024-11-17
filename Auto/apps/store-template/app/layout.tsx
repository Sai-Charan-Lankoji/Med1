'use client'
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../public/globals.css"
import Navbar from "./navbar/page"
import React, { useEffect } from "react"  // Added useEffect import
//import { CartProvider } from "@/context/cartContext"
import { UserProvider } from "@/context/userContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MedusaProvider } from "medusa-react"
import { SvgProvider } from "@/context/svgcontext" 
import { store } from "../reducer/store";
import { Provider } from "react-redux";

const queryClient = new QueryClient()
const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Customized Football Jersey Design",
//   description: "Design and order your custom football jersey",
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MedusaProvider
            queryClientProviderProps={{ client: queryClient }}
            baseUrl={process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}
            publishableApiKey={process.env.NEXT_PUBLIC_MEDUSA_API_KEY}
          >
            
              <UserProvider>
                <SvgProvider>
                  <main className="min-h-screen">
                    <Navbar />
                    <div className="pt-20 px-2 sm:px-6 lg:px-8 max-w-8xl mx-auto">
                      {children}
                    </div>
                  </main>
                </SvgProvider>
              </UserProvider>
            
          </MedusaProvider>
        </QueryClientProvider>
        </Provider>
      </body>
    </html>
  )
}