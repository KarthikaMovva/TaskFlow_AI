"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    FolderKanban,
    CheckSquare,
    Clock,
    CheckCircle2,
    AlertTriangle,
    BrainCircuit,
    Plus,
    ArrowRight,
    TrendingUp,
    Sparkles,
    Activity,
    ShieldAlert,
} from "lucide-react";
import { useWorkspace } from "@/src/context/workspace-context";
import { taskApi } from "@/src/api/task.api";
import { activityApi } from "@/src/api/activity.api";
import { aiApi } from "@/src/api/ai.api";
import { Task, Activity as ActivityType, AIAnalysis } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import CreateProjectModal from "@/components/projects/create-project-modal";

export default function DashboardPage() {
    const { activeWorkspace, projects, loading: wsLoading } = useWorkspace();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
    const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);

    const fetchDashboardData = async () => {
        if (!activeWorkspace) {
            setTasks([]);
            setActivities([]);
            setLoadingData(false);
            return;
        }

        setLoadingData(true);
        try {
            // Fetch tasks across projects in workspace
            let allTasks: Task[] = [];
            for (const proj of projects) {
                const projTasks = await taskApi.getByProject(proj.id);
                allTasks = [...allTasks, ...projTasks];
            }
            setTasks(allTasks);

            // Fetch workspace activities
            const activityList = await activityApi.getByWorkspace(activeWorkspace.id);
            setActivities(activityList);
        } catch (err) {
            console.error("Dashboard data load error", err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [activeWorkspace, projects]);

    // Calculate metrics
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "DONE").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const todoTasks = tasks.filter((t) => t.status === "TODO" || t.status === "IN_REVIEW").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // AI Analysis derived from active project / tasks
    const activeProject = projects[0] || { id: "default", name: activeWorkspace?.name || "Workspace", status: "ACTIVE" };
    const aiAnalysis: AIAnalysis = aiApi.analyzeProject(activeProject as any, tasks);

    const isLoading = wsLoading || loadingData;

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                        Workspace Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Real-time project metrics, task health, and AI insights for{" "}
                        <span className="font-semibold text-purple-700">{activeWorkspace?.name || "your workspace"}</span>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => setCreateProjectOpen(true)} variant="outline" className="gap-2">
                        <FolderKanban size={16} />
                        <span>New Project</span>
                    </Button>
                    <Button onClick={() => setCreateTaskOpen(true)} className="bg-purple-700 hover:bg-purple-800 gap-2">
                        <Plus size={16} />
                        <span>New Task</span>
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-gray-200/80 shadow-xs hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Total Projects
                        </CardTitle>
                        <FolderKanban className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="flex items-baseline justify-between">
                                <span className="text-3xl font-bold text-gray-900">{totalProjects}</span>
                                <span className="text-xs text-gray-500 font-medium">active workspace</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-gray-200/80 shadow-xs hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Total Tasks
                        </CardTitle>
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="flex items-baseline justify-between">
                                <span className="text-3xl font-bold text-gray-900">{totalTasks}</span>
                                <span className="text-xs text-gray-500 font-medium">{completedTasks} completed</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-gray-200/80 shadow-xs hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Completion Rate
                        </CardTitle>
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-3xl font-bold text-emerald-600">{completionRate}%</span>
                                    <span className="text-xs text-gray-500">{completedTasks}/{totalTasks} tasks</span>
                                </div>
                                <Progress value={completionRate} colorClassName="bg-emerald-600" />
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-gray-200/80 shadow-xs hover:shadow-md transition bg-gradient-to-br from-purple-50/50 via-white to-purple-50/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                            AI Health Score
                        </CardTitle>
                        <BrainCircuit className="h-5 w-5 text-purple-700" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="flex items-baseline justify-between">
                                <span className="text-3xl font-bold text-purple-700">{aiAnalysis.healthScore} / 100</span>
                                <Badge
                                    className={
                                        aiAnalysis.status === "HEALTHY"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : aiAnalysis.status === "WARNING"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-red-100 text-red-800"
                                    }
                                >
                                    {aiAnalysis.status}
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* AI Summary Banner */}
            <Card className="border-purple-200 bg-purple-900/5 backdrop-blur-xs p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                            <Sparkles size={18} />
                            <span>AI Project Intelligence</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 leading-relaxed max-w-3xl">
                            {isLoading ? "Analyzing project health..." : aiAnalysis.summaryNarrative}
                        </p>
                    </div>
                    <Link href="/ai-insights">
                        <Button className="bg-purple-700 hover:bg-purple-800 text-white gap-2 shadow-sm whitespace-nowrap">
                            <span>Explore Insights</span>
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* Main Content Grid: High-Risk Tasks & Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* High Risk Tasks Widget */}
                <Card className="lg:col-span-2 border-gray-200/80 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ShieldAlert size={20} className="text-amber-600" />
                                High-Risk Tasks
                            </CardTitle>
                            <CardDescription>Tasks requiring immediate attention or re-assignment</CardDescription>
                        </div>
                        <Link href="/tasks" className="text-xs font-semibold text-purple-700 hover:underline">
                            View All Tasks
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : aiAnalysis.highRiskTasks.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                                <p className="font-semibold text-gray-900">No high-risk tasks detected!</p>
                                <p className="text-xs text-gray-400 mt-1">All tasks are on track with normal priority and assignees.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {aiAnalysis.highRiskTasks.map(({ task, reason, riskLevel }) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:bg-gray-100/60"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900 text-sm">{task.title}</span>
                                                <Badge className={riskLevel === "CRITICAL" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>
                                                    {riskLevel}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <AlertTriangle size={12} className="text-amber-600" />
                                                <span>{reason}</span>
                                            </p>
                                        </div>
                                        <Link href={`/kanban`}>
                                            <Button size="sm" variant="outline" className="text-xs">
                                                Manage Task
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity Timeline */}
                <Card className="border-gray-200/80 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Activity size={20} className="text-purple-600" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>Live workspace updates</CardDescription>
                        </div>
                        <Link href="/activity" className="text-xs font-semibold text-purple-700 hover:underline">
                            View All
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="py-8 text-center text-xs text-gray-400">No recent workspace activity</div>
                        ) : (
                            <div className="space-y-4">
                                {activities.slice(0, 5).map((act) => (
                                    <div key={act.id} className="flex gap-3 text-xs">
                                        <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-semibold shrink-0">
                                            {act.user?.name ? act.user.name[0] : "T"}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-semibold text-gray-900">{act.action}</p>
                                            {act.description && <p className="text-gray-500 leading-normal">{act.description}</p>}
                                            <p className="text-[10px] text-gray-400">{new Date(act.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            <CreateTaskModal open={isCreateTaskOpen} onOpenChange={setCreateTaskOpen} onSuccess={fetchDashboardData} />
            <CreateProjectModal open={isCreateProjectOpen} onOpenChange={setCreateProjectOpen} />
        </div>
    );
}