"use client";

import React, { useEffect, useState } from "react";
import { CheckSquare, Plus, Search, Filter, Calendar, User, ArrowUpDown, ChevronRight } from "lucide-react";
import { useWorkspace } from "@/src/context/workspace-context";
import { taskApi } from "@/src/api/task.api";
import { Task, TaskStatus, Priority } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import TaskDetailSheet from "@/components/tasks/task-detail-sheet";
import toast from "react-hot-toast";

export default function TasksPage() {
    const { projects, activeWorkspace, loading: wsLoading } = useWorkspace();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    const [search, setSearch] = useState("");
    const [projectFilter, setProjectFilter] = useState<string>("ALL");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailSheetOpen, setDetailSheetOpen] = useState(false);

    const fetchAllTasks = async () => {
        if (!activeWorkspace) {
            setTasks([]);
            setLoadingTasks(false);
            return;
        }

        setLoadingTasks(true);
        try {
            let list: Task[] = [];
            for (const p of projects) {
                const pTasks = await taskApi.getByProject(p.id);
                list = [...list, ...pTasks];
            }
            setTasks(list);
        } catch (err) {
            toast.error("Failed to load tasks");
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        fetchAllTasks();
    }, [activeWorkspace, projects]);

    const filteredTasks = tasks.filter((t) => {
        const matchesSearch =
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
        const matchesProject = projectFilter === "ALL" || t.projectId === projectFilter;
        const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
        const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
        return matchesSearch && matchesProject && matchesStatus && matchesPriority;
    });

    const getPriorityBadge = (priority: Priority) => {
        switch (priority) {
            case "URGENT":
                return <Badge className="bg-red-100 text-red-800 text-[10px] font-bold">URGENT</Badge>;
            case "HIGH":
                return <Badge className="bg-amber-100 text-amber-800 text-[10px] font-semibold">HIGH</Badge>;
            case "MEDIUM":
                return <Badge className="bg-blue-100 text-blue-800 text-[10px]">MEDIUM</Badge>;
            case "LOW":
                return <Badge className="bg-gray-100 text-gray-700 text-[10px]">LOW</Badge>;
        }
    };

    const getStatusBadge = (status: TaskStatus) => {
        switch (status) {
            case "DONE":
                return <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">DONE</Badge>;
            case "IN_PROGRESS":
                return <Badge className="bg-blue-100 text-blue-800 text-[10px]">IN PROGRESS</Badge>;
            case "IN_REVIEW":
                return <Badge className="bg-amber-100 text-amber-800 text-[10px]">IN REVIEW</Badge>;
            case "TODO":
                return <Badge className="bg-gray-100 text-gray-800 text-[10px]">TO DO</Badge>;
        }
    };

    const handleOpenDetail = (task: Task) => {
        setSelectedTask(task);
        setDetailSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl flex items-center gap-2">
                        <CheckSquare className="text-purple-700" />
                        Tasks Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Centralized task table for{" "}
                        <span className="font-semibold text-purple-700">{activeWorkspace?.name || "your workspace"}</span>.
                    </p>
                </div>
                <Button onClick={() => setCreateModalOpen(true)} className="bg-purple-700 hover:bg-purple-800 gap-2">
                    <Plus size={16} />
                    <span>Create Task</span>
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                    <Input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 text-xs"
                    />
                </div>

                <Select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    options={[
                        { label: "All Projects", value: "ALL" },
                        ...projects.map((p) => ({ label: p.name, value: p.id })),
                    ]}
                    className="text-xs"
                />

                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[
                        { label: "All Statuses", value: "ALL" },
                        { label: "To Do", value: "TODO" },
                        { label: "In Progress", value: "IN_PROGRESS" },
                        { label: "In Review", value: "IN_REVIEW" },
                        { label: "Done", value: "DONE" },
                    ]}
                    className="text-xs"
                />

                <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    options={[
                        { label: "All Priorities", value: "ALL" },
                        { label: "Urgent", value: "URGENT" },
                        { label: "High", value: "HIGH" },
                        { label: "Medium", value: "MEDIUM" },
                        { label: "Low", value: "LOW" },
                    ]}
                    className="text-xs"
                />
            </div>

            {/* Tasks Table */}
            {wsLoading || loadingTasks ? (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
                    No tasks found matching current filters.
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Assignee</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTasks.map((t) => (
                            <TableRow key={t.id} onClick={() => handleOpenDetail(t)} className="cursor-pointer">
                                <TableCell className="font-semibold text-gray-900">
                                    {t.title}
                                    {t.description && <p className="text-xs text-gray-400 font-normal line-clamp-1 mt-0.5">{t.description}</p>}
                                </TableCell>
                                <TableCell>{getStatusBadge(t.status)}</TableCell>
                                <TableCell>{getPriorityBadge(t.priority)}</TableCell>
                                <TableCell>
                                    {t.assignedTo ? (
                                        <div className="flex items-center gap-2 text-xs">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="bg-purple-100 text-[10px] text-purple-700 font-bold">
                                                    {t.assignedTo.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{t.assignedTo.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 font-normal">Unassigned</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-xs text-gray-500">
                                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-700">
                                        <ChevronRight size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Modals & Detail Sheet */}
            <CreateTaskModal open={isCreateModalOpen} onOpenChange={setCreateModalOpen} onSuccess={fetchAllTasks} />
            <TaskDetailSheet
                task={selectedTask}
                open={isDetailSheetOpen}
                onOpenChange={setDetailSheetOpen}
                onUpdate={fetchAllTasks}
            />
        </div>
    );
}
