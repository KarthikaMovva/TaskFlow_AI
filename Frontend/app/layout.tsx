import "./globals.css";
import { AuthProvider } from "@/src/context/auth-context";
import QueryProvider from "@/src/providers/query-provider";
import { Toaster } from "react-hot-toast";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      <body>

        <QueryProvider>

          <AuthProvider>

            {children}

          </AuthProvider>

        </QueryProvider>


        <Toaster
          position="top-right"
        />

      </body>

    </html>
  );
}