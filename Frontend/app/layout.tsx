import type { Metadata } from "next";
import "./globals.css";
// import { QueryProvider } from "@/src/providers/query-provider.ts";


export const metadata: Metadata = {
  title: "TaskFlow AI",
  description: "AI powered project management platform",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body>
        {/* <QueryProvider> */}
        {children}
        {/* </QueryProvider> */}
      </body>
    </html>
  );

}