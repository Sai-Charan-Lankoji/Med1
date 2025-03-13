// app/layout.tsx
import { ReactNode } from "react";
import "../app/globals.css";
import { ThemeProvider } from "@/app/lib/ThemeContext";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
        {children}
        </ThemeProvider>
        </body>
    </html>
  );
}