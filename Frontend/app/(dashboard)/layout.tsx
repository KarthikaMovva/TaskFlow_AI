"use client";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import ProtectedRoute from "@/components/auth/protected-route";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex flex-1 flex-col">
                    <Navbar />
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}