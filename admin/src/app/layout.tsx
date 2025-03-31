import { ReactNode } from "react";
import "../app/globals.css";
import { ThemeProvider } from "@/app/lib/ThemeContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}