"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, Check, Trash2, Sparkles, Building, Menu } from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { useWorkspace } from "@/src/context/workspace-context";
import { notificationApi } from "@/src/api/notification.api";
import { Notification } from "@/src/types";
import { Popover } from "@/components/ui/popover";
import toast from "react-hot-toast";

interface NavbarProps {
    onOpenMobileSidebar?: () => void;
}

export default function Navbar({ onOpenMobileSidebar }: NavbarProps) {
    const { user, logout } = useAuth();
    const { activeOrg, activeWorkspace } = useWorkspace();
    const router = useRouter();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const list = await notificationApi.getAll();
            const count = await notificationApi.getUnreadCount();
            setNotifications(list);
            setUnreadCount(count);
        } catch (err) {
            // silent catch
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        router.replace("/login");
    };

    const handleMarkRead = async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            await fetchNotifications();
        } catch (err) {
            toast.error("Failed to update notification");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            toast.success("All notifications marked as read");
            await fetchNotifications();
        } catch (err) {
            toast.error("Failed to mark all as read");
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await notificationApi.delete(id);
            await fetchNotifications();
        } catch (err) {
            toast.error("Failed to delete notification");
        }
    };

    const getUserInitials = () => {
        if (!user || !user.name) return "TF";
        return user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-4 md:px-6 backdrop-blur-md">
            {/* Left section: Breadcrumb / Mobile menu toggle */}
            <div className="flex items-center gap-3">
                {onOpenMobileSidebar && (
                    <button
                        onClick={onOpenMobileSidebar}
                        className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <Menu size={20} />
                    </button>
                )}

                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Building size={16} className="text-gray-400" />
                    <span>{activeOrg ? activeOrg.name : "Organization"}</span>
                    <span className="text-gray-300">/</span>
                    <span className="font-semibold text-gray-900">{activeWorkspace ? activeWorkspace.name : "Workspace"}</span>
                </div>
            </div>

            {/* Right section: Notifications & User profile */}
            <div className="flex items-center gap-4">
                {/* Notifications Popover */}
                <Popover
                    align="right"
                    trigger={
                        <button className="relative rounded-full p-2 text-gray-500 hover:bg-purple-50 hover:text-purple-700 transition">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>
                    }
                >
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs font-medium text-purple-700 hover:underline"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                            {notifications.length === 0 ? (
                                <div className="py-6 text-center text-xs text-gray-400">No notifications right now</div>
                            ) : (
                                notifications.map((n) => (
                                    <div key={n.id} className={`p-2 text-xs space-y-1 ${n.isRead ? "opacity-60" : "bg-purple-50/40 rounded-lg"}`}>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-900">{n.title}</span>
                                            <div className="flex items-center gap-1">
                                                {!n.isRead && (
                                                    <button
                                                        onClick={() => handleMarkRead(n.id)}
                                                        className="text-purple-700 hover:text-purple-900"
                                                        title="Mark read"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteNotification(n.id)}
                                                    className="text-gray-400 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-normal">{n.message}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </Popover>

                {/* User Avatar & Menu */}
                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                    <Avatar className="h-9 w-9 border border-purple-200">
                        <AvatarFallback className="bg-purple-100 font-semibold text-purple-700">
                            {getUserInitials()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="hidden lg:block text-left text-xs">
                        <p className="font-semibold text-gray-900 leading-none">{user?.name || "User"}</p>
                        <p className="text-gray-400 leading-none mt-1">{user?.email || ""}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}