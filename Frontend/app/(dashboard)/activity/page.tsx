"use client";

import React, { useEffect, useState } from "react";
import { Activity as ActivityIcon, Filter, Clock, User, CheckCircle2 } from "lucide-react";
import { useWorkspace } from "@/src/context/workspace-context";
import { activityApi } from "@/src/api/activity.api";
import { Activity } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ActivityPage() {
    const { activeWorkspace, loading: wsLoading } = useWorkspace();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        if (!activeWorkspace) {
            setActivities([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const list = await activityApi.getByWorkspace(activeWorkspace.id);
            setActivities(list);
        } catch (err) {
            console.error("Failed to load activities", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [activeWorkspace]);

    const getUserInitials = (name?: string) => {
        if (!name) return "T";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl flex items-center gap-2">
                    <ActivityIcon className="text-purple-700" />
                    Activity History
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Chronological audit log of events and updates across{" "}
                    <span className="font-semibold text-purple-700">{activeWorkspace?.name || "your workspace"}</span>.
                </p>
            </div>

            {/* Timeline Feed */}
            <Card className="border-gray-200/80 shadow-xs">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">Workspace Activity Feed</CardTitle>
                    <CardDescription>Real-time audit log</CardDescription>
                </CardHeader>
                <CardContent>
                    {wsLoading || loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="py-12 text-center text-xs text-gray-400">
                            No activities logged for this workspace yet.
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-purple-100 ml-4 space-y-6 py-2">
                            {activities.map((act) => (
                                <div key={act.id} className="relative pl-6">
                                    {/* Timeline Node */}
                                    <div className="absolute -left-3.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-purple-700 text-white font-bold text-xs ring-4 ring-white">
                                        {getUserInitials(act.user?.name)}
                                    </div>

                                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-1.5 hover:bg-gray-100/60 transition">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm text-gray-900">{act.action}</span>
                                            {act.entityType && (
                                                <Badge variant="outline" className="text-[10px]">
                                                    {act.entityType}
                                                </Badge>
                                            )}
                                        </div>
                                        {act.description && <p className="text-xs text-gray-600 leading-relaxed">{act.description}</p>}
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1 pt-1">
                                            <Clock size={11} />
                                            <span>{new Date(act.createdAt).toLocaleString()}</span>
                                            {act.user?.name && <span className="font-medium text-gray-600">by {act.user.name}</span>}
                                        </p>
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
