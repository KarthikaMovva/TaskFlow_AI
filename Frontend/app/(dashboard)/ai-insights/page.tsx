"use client";

import React, { useEffect, useState } from "react";
import {
    BrainCircuit,
    Sparkles,
    ShieldAlert,
    TrendingUp,
    Users,
    Lightbulb,
    FolderKanban,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import { useWorkspace } from "@/src/context/workspace-context";
import { taskApi } from "@/src/api/task.api";
import { aiApi } from "@/src/api/ai.api";
import { Task, AIAnalysis } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIInsightsPage() {
    const { projects, activeProject, setActiveProject, activeWorkspace, loading: wsLoading } = useWorkspace();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    const fetchTasks = async () => {
        if (!activeProject) {
            setTasks([]);
            setLoadingTasks(false);
            return;
        }

        setLoadingTasks(true);
        try {
            const data = await taskApi.getByProject(activeProject.id);
            setTasks(data);
        } catch (err) {
            console.error("Failed to load AI project tasks", err);
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [activeProject]);

    const targetProject = activeProject || { id: "default", name: activeWorkspace?.name || "Workspace", status: "ACTIVE" };
    const aiAnalysis: AIAnalysis = aiApi.analyzeProject(targetProject as any, tasks);

    const isLoading = wsLoading || loadingTasks;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl flex items-center gap-2">
                        <BrainCircuit className="text-purple-700" />
                        AI Insights & Intelligence
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Automated risk analysis, project health scoring, and team workload telemetry.
                    </p>
                </div>

                {projects.length > 0 && (
                    <div className="w-64">
                        <Select
                            value={activeProject?.id || ""}
                            onChange={(e) => {
                                const p = projects.find((proj) => proj.id === e.target.value);
                                if (p) setActiveProject(p);
                            }}
                            options={projects.map((p) => ({ label: p.name, value: p.id }))}
                        />
                    </div>
                )}
            </div>

            {/* AI Health Overview Banner */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-900/10 via-purple-500/5 to-white p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-700 text-white font-bold">
                                <Sparkles size={18} />
                            </span>
                            <span className="font-bold text-gray-900 text-lg">AI Project Narrative</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 leading-relaxed">
                            {isLoading ? "Generating project intelligence summary..." : aiAnalysis.summaryNarrative}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-purple-200/60 pt-4 md:pt-0 md:pl-6 shrink-0">
                        <div className="text-center">
                            <p className="text-xs font-semibold text-purple-700 uppercase">Health Score</p>
                            <p className="text-4xl font-extrabold text-purple-700 mt-1">{aiAnalysis.healthScore} / 100</p>
                        </div>
                        <Badge
                            className={
                                aiAnalysis.status === "HEALTHY"
                                    ? "bg-emerald-100 text-emerald-800 text-sm px-3 py-1 font-bold"
                                    : aiAnalysis.status === "WARNING"
                                    ? "bg-amber-100 text-amber-800 text-sm px-3 py-1 font-bold"
                                    : "bg-red-100 text-red-800 text-sm px-3 py-1 font-bold"
                            }
                        >
                            {aiAnalysis.status}
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Key AI Telemetry Metrics */}
            <div className="grid gap-5 sm:grid-cols-3">
                <Card className="border-gray-200/80 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Completion Velocity
                        </CardTitle>
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-3xl font-bold text-emerald-600">{aiAnalysis.completionRate}%</div>
                        <Progress value={aiAnalysis.completionRate} colorClassName="bg-emerald-600" />
                        <p className="text-xs text-gray-500">
                            {aiAnalysis.completedTasks} completed out of {aiAnalysis.totalTasks} tasks
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-gray-200/80 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Risk Detection
                        </CardTitle>
                        <ShieldAlert className="h-5 w-5 text-amber-600" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-bold text-gray-900">{aiAnalysis.highRiskTasks.length}</div>
                        <p className="text-xs text-gray-500">Tasks flagged with schedule or priority risks</p>
                    </CardContent>
                </Card>

                <Card className="border-gray-200/80 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Active Team Workload
                        </CardTitle>
                        <Users className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-bold text-gray-900">{aiAnalysis.workloadDistribution.length}</div>
                        <p className="text-xs text-gray-500">Team members with active assigned tasks</p>
                    </CardContent>
                </Card>
            </div>

            {/* High-Risk Tasks Analysis & Recommendations */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* High Risk Tasks breakdown */}
                <Card className="border-gray-200/80 shadow-xs">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <ShieldAlert size={20} className="text-amber-600" />
                            High-Risk Task Detection
                        </CardTitle>
                        <CardDescription>AI identified bottleneck risks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {aiAnalysis.highRiskTasks.length === 0 ? (
                            <div className="py-8 text-center text-xs text-gray-400">
                                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                                No risk flags detected! All tasks are healthy.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {aiAnalysis.highRiskTasks.map(({ task, reason, riskLevel }) => (
                                    <div key={task.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm text-gray-900">{task.title}</span>
                                            <Badge className={riskLevel === "CRITICAL" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>
                                                {riskLevel}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <AlertTriangle size={12} className="text-amber-600" />
                                            <span>{reason}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card className="border-gray-200/80 shadow-xs">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Lightbulb size={20} className="text-purple-700" />
                            Actionable Recommendations
                        </CardTitle>
                        <CardDescription>AI generated optimizations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {aiAnalysis.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50/30 p-3.5 text-xs font-medium text-gray-800">
                                    <Sparkles size={16} className="text-purple-700 shrink-0 mt-0.5" />
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
