"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    KanbanSquare,
    CheckSquare,
    BrainCircuit,
    Activity,
    Bell,
    Settings,
    X,
    Sparkles,
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Kanban Board", href: "/kanban", icon: KanbanSquare },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "AI Insights", href: "/ai-insights", icon: BrainCircuit, badge: "AI" },
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const pathname = usePathname();

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

            <div className="relative z-50 flex h-full w-72 flex-col bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <Link href="/" onClick={onClose} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-700 text-white font-bold">
                            <Sparkles size={16} />
                        </div>
                        <span className="font-bold text-gray-900">TaskFlow AI</span>
                    </Link>
                    <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-purple-50 text-purple-700 font-semibold"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} className={isActive ? "text-purple-700" : "text-gray-400"} />
                                    <span>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
