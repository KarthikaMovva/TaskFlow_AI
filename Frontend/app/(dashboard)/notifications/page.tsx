"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check, Trash2, CheckCheck, Clock } from "lucide-react";
import { notificationApi } from "@/src/api/notification.api";
import { Notification } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const list = await notificationApi.getAll();
            setNotifications(list);
        } catch (err) {
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkRead = async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            toast.success("Notification marked as read");
            await fetchNotifications();
        } catch (err) {
            toast.error("Failed to mark as read");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            toast.success("All notifications marked as read");
            await fetchNotifications();
        } catch (err) {
            toast.error("Failed to mark all read");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationApi.delete(id);
            toast.success("Notification deleted");
            await fetchNotifications();
        } catch (err) {
            toast.error("Failed to delete notification");
        }
    };

    const filtered = notifications.filter((n) => (filter === "UNREAD" ? !n.isRead : true));

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl flex items-center gap-2">
                        <Bell className="text-purple-700" />
                        Notifications Center
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">System alerts, task assignments, and workspace updates.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleMarkAllRead} variant="outline" size="sm" className="gap-2 text-xs">
                        <CheckCheck size={16} />
                        <span>Mark All Read</span>
                    </Button>
                </div>
            </div>

            {/* Filter Tabs & Content */}
            <Card className="border-gray-200/80 shadow-xs">
                <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant={filter === "ALL" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter("ALL")}
                            className={filter === "ALL" ? "bg-purple-700 text-white" : "text-xs"}
                        >
                            All ({notifications.length})
                        </Button>
                        <Button
                            variant={filter === "UNREAD" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter("UNREAD")}
                            className={filter === "UNREAD" ? "bg-purple-700 text-white" : "text-xs"}
                        >
                            Unread ({notifications.filter((n) => !n.isRead).length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-12 text-center text-xs text-gray-400">No notifications found</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filtered.map((n) => (
                                <div
                                    key={n.id}
                                    className={`flex items-start justify-between p-4 rounded-xl transition ${
                                        n.isRead ? "bg-white opacity-70" : "bg-purple-50/40 font-semibold"
                                    }`}
                                >
                                    <div className="space-y-1 pr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">{n.title}</span>
                                            {!n.isRead && <Badge className="bg-purple-700 text-white text-[10px]">New</Badge>}
                                        </div>
                                        <p className="text-xs text-gray-600 font-normal leading-relaxed">{n.message}</p>
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1 pt-1 font-normal">
                                            <Clock size={11} />
                                            <span>{new Date(n.createdAt).toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!n.isRead && (
                                            <Button
                                                onClick={() => handleMarkRead(n.id)}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs text-purple-700 border-purple-200 hover:bg-purple-50"
                                            >
                                                <Check size={14} />
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleDelete(n.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-400 hover:text-red-600"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
