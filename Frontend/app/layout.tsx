import "./globals.css";
import { AuthProvider } from "@/src/context/auth-context";
import { WorkspaceProvider } from "@/src/context/workspace-context";
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
            <WorkspaceProvider>
              {children}
            </WorkspaceProvider>
          </AuthProvider>
        </QueryProvider>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}