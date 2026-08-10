"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import ProtectedRoute from "@/components/auth/protected-route";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50/60 font-sans text-gray-900 antialiased">
                <Sidebar />
                <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Navbar onOpenMobileSidebar={() => setMobileOpen(true)} />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl">{children}</div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}