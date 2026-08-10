"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FolderKanban, Plus, Search, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { useWorkspace } from "@/src/context/workspace-context";
import { Project, ProjectStatus } from "@/src/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CreateProjectModal from "@/components/projects/create-project-modal";

export default function ProjectsPage() {
    const { projects, activeWorkspace, loading, refreshProjects } = useWorkspace();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const filteredProjects = projects.filter((proj) => {
        const matchesSearch =
            proj.name.toLowerCase().includes(search.toLowerCase()) ||
            (proj.description && proj.description.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === "ALL" || proj.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: ProjectStatus) => {
        switch (status) {
            case "ACTIVE":
                return <Badge className="bg-emerald-100 text-emerald-800">Active</Badge>;
            case "PLANNING":
                return <Badge className="bg-blue-100 text-blue-800">Planning</Badge>;
            case "COMPLETED":
                return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
            case "ARCHIVED":
                return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Projects</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage and track software projects in{" "}
                        <span className="font-semibold text-purple-700">{activeWorkspace?.name || "your workspace"}</span>.
                    </p>
                </div>
                <Button onClick={() => setCreateModalOpen(true)} className="bg-purple-700 hover:bg-purple-800 gap-2">
                    <Plus size={16} />
                    <span>Create Project</span>
                </Button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <Input
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {["ALL", "ACTIVE", "PLANNING", "COMPLETED", "ARCHIVED"].map((st) => (
                        <Button
                            key={st}
                            variant={statusFilter === st ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(st)}
                            className={statusFilter === st ? "bg-purple-700 text-white hover:bg-purple-800" : "text-xs"}
                        >
                            {st === "ALL" ? "All Projects" : st.charAt(0) + st.slice(1).toLowerCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
                    <FolderKanban className="mx-auto h-12 w-12 text-purple-400 mb-3" />
                    <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
                    <p className="text-sm text-gray-500 mt-1">Get started by creating your first project for this workspace.</p>
                    <Button onClick={() => setCreateModalOpen(true)} className="mt-4 bg-purple-700 hover:bg-purple-800 gap-2">
                        <Plus size={16} />
                        <span>Create Project</span>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="flex flex-col justify-between border-gray-200/80 hover:shadow-md transition">
                            <CardHeader className="space-y-2">
                                <div className="flex items-center justify-between">
                                    {getStatusBadge(project.status)}
                                    <span className="text-[11px] text-gray-400">
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition">
                                    {project.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-xs leading-normal text-gray-500">
                                    {project.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Link href={`/kanban?projectId=${project.id}`}>
                                        <Button size="sm" variant="outline" className="text-xs">
                                            Kanban Board
                                        </Button>
                                    </Link>
                                </div>
                                <Link href={`/projects/${project.id}`}>
                                    <Button size="sm" className="bg-purple-700 hover:bg-purple-800 text-xs gap-1">
                                        <span>Overview</span>
                                        <ArrowRight size={14} />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Project Modal */}
            <CreateProjectModal open={isCreateModalOpen} onOpenChange={setCreateModalOpen} onSuccess={refreshProjects} />
        </div>
    );
}
