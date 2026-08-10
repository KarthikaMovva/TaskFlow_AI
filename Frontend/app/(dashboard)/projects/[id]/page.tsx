"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    FolderKanban,
    KanbanSquare,
    Plus,
    CheckCircle2,
    Clock,
    AlertTriangle,
    BrainCircuit,
    ArrowLeft,
    Trash2,
    Edit3,
} from "lucide-react";
import { projectApi } from "@/src/api/project.api";
import { taskApi } from "@/src/api/task.api";
import { aiApi } from "@/src/api/ai.api";
import { Project, Task, AIAnalysis } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import toast from "react-hot-toast";

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params?.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);

    const fetchProjectDetails = async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            const projData = await projectApi.getById(projectId);
            const taskData = await taskApi.getByProject(projectId);
            setProject(projData);
            setTasks(taskData);
        } catch (err) {
            toast.error("Failed to load project details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const handleDeleteProject = async () => {
        if (!project) return;
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

        try {
            await projectApi.delete(project.id);
            toast.success("Project deleted successfully");
            router.push("/projects");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete project");
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-48 w-full" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="py-12 text-center text-sm text-gray-500">
                <p>Project not found.</p>
                <Link href="/projects" className="mt-4 text-purple-700 font-semibold inline-block">
                    Return to Projects
                </Link>
            </div>
        );
    }

    const aiAnalysis: AIAnalysis = aiApi.analyzeProject(project, tasks);

    return (
        <div className="space-y-8">
            {/* Top Navigation & Actions */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <Link href="/projects" className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-700">
                    <ArrowLeft size={16} />
                    <span>Back to Projects</span>
                </Link>

                <div className="flex items-center gap-2">
                    <Link href={`/kanban?projectId=${project.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                            <KanbanSquare size={16} />
                            <span>Open Board</span>
                        </Button>
                    </Link>
                    <Button onClick={() => setCreateTaskOpen(true)} size="sm" className="bg-purple-700 hover:bg-purple-800 gap-2">
                        <Plus size={16} />
                        <span>Add Task</span>
                    </Button>
                    <Button onClick={handleDeleteProject} variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:border-red-200">
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>

            {/* Project Overview Card */}
            <Card className="border-gray-200/80 shadow-xs">
                <CardHeader className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-purple-100 text-purple-800">{project.status}</Badge>
                        <span className="text-xs text-gray-400">Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{project.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 leading-relaxed">
                        {project.description || "No description specified."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 border-t border-gray-100 grid gap-4 sm:grid-cols-3">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase">Tasks Overview</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">{aiAnalysis.totalTasks} total tasks</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase">Completion Rate</p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xl font-bold text-emerald-600">{aiAnalysis.completionRate}%</span>
                            <Progress value={aiAnalysis.completionRate} colorClassName="bg-emerald-600" className="w-24" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-purple-700 uppercase">AI Health Score</p>
                        <p className="text-xl font-bold text-purple-700 mt-1">{aiAnalysis.healthScore} / 100 ({aiAnalysis.status})</p>
                    </div>
                </CardContent>
            </Card>

            {/* AI Summary Banner */}
            <Card className="border-purple-200 bg-purple-900/5 p-6">
                <div className="flex items-start gap-3">
                    <BrainCircuit className="h-6 w-6 text-purple-700 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                        <h4 className="font-bold text-gray-900 text-sm">AI Narrative Summary</h4>
                        <p className="text-xs text-gray-700 leading-relaxed">{aiAnalysis.summaryNarrative}</p>
                    </div>
                </div>
            </Card>

            {/* Task Breakdown Table */}
            <Card className="border-gray-200/80 shadow-xs">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900">Project Tasks</CardTitle>
                    <CardDescription>All tasks assigned to this project</CardDescription>
                </CardHeader>
                <CardContent>
                    {tasks.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                            No tasks created for this project yet. Click "Add Task" above to get started.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 overflow-x-auto">
                            {tasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between py-3 px-2 hover:bg-gray-50/50 rounded-lg">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-gray-900">{task.title}</span>
                                            <Badge variant="outline" className="text-[10px]">
                                                {task.priority}
                                            </Badge>
                                        </div>
                                        {task.description && <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            className={
                                                task.status === "DONE"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : task.status === "IN_PROGRESS"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }
                                        >
                                            {task.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <CreateTaskModal open={isCreateTaskOpen} onOpenChange={setCreateTaskOpen} projectId={project.id} onSuccess={fetchProjectDetails} />
        </div>
    );
}
