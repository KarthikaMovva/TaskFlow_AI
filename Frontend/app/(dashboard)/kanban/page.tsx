"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Filter, FolderKanban, KanbanSquare } from "lucide-react";
import { useWorkspace } from "@/src/context/workspace-context";
import { taskApi } from "@/src/api/task.api";
import { kanbanApi } from "@/src/api/kanban.api";
import { Task, KanbanBoardData, TaskStatus, Priority } from "@/src/types";
import KanbanColumn from "@/components/kanban/kanban-column";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import TaskDetailSheet from "@/components/tasks/task-detail-sheet";
import toast from "react-hot-toast";

export default function KanbanBoardPage() {
    const searchParams = useSearchParams();
    const queryProjectId = searchParams.get("projectId");

    const { projects, activeProject, setActiveProject, loading: wsLoading } = useWorkspace();

    const [board, setBoard] = useState<KanbanBoardData>({
        TODO: [],
        IN_PROGRESS: [],
        IN_REVIEW: [],
        DONE: [],
    });
    const [loadingBoard, setLoadingBoard] = useState(true);

    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

    const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailSheetOpen, setDetailSheetOpen] = useState(false);

    // Sync selected project from query param if available
    useEffect(() => {
        if (queryProjectId && projects.length > 0) {
            const p = projects.find((proj) => proj.id === queryProjectId);
            if (p) setActiveProject(p);
        }
    }, [queryProjectId, projects]);

    const fetchBoard = async () => {
        if (!activeProject) {
            setBoard({ TODO: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [] });
            setLoadingBoard(false);
            return;
        }

        setLoadingBoard(true);
        try {
            const data = await kanbanApi.getBoard(activeProject.id);
            setBoard(data || { TODO: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [] });
        } catch (err) {
            toast.error("Failed to load Kanban board");
        } finally {
            setLoadingBoard(false);
        }
    };

    useEffect(() => {
        fetchBoard();
    }, [activeProject]);

    // Apply filtering to tasks inside board columns
    const filterTasks = (tasks: Task[]) => {
        return tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
            const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
            return matchesSearch && matchesPriority;
        });
    };

    const filteredBoard = useMemo(() => {
        return {
            TODO: filterTasks(board.TODO || []),
            IN_PROGRESS: filterTasks(board.IN_PROGRESS || []),
            IN_REVIEW: filterTasks(board.IN_REVIEW || []),
            DONE: filterTasks(board.DONE || []),
        };
    }, [board, search, priorityFilter]);

    const handleSelectTask = (task: Task) => {
        setSelectedTask(task);
        setDetailSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl flex items-center gap-2">
                        <KanbanSquare className="text-purple-700" />
                        Kanban Board
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Interactive workflow columns for{" "}
                        <span className="font-semibold text-purple-700">{activeProject ? activeProject.name : "Select a project"}</span>
                    </p>
                </div>
                <Button
                    onClick={() => setCreateTaskOpen(true)}
                    disabled={!activeProject}
                    className="bg-purple-700 hover:bg-purple-800 gap-2"
                >
                    <Plus size={16} />
                    <span>Create Task</span>
                </Button>
            </div>

            {/* Filter & Project selector controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                    <FolderKanban size={18} className="text-purple-700 shrink-0" />
                    <Select
                        value={activeProject?.id || ""}
                        onChange={(e) => {
                            const p = projects.find((proj) => proj.id === e.target.value);
                            if (p) setActiveProject(p);
                        }}
                        options={
                            projects.length > 0
                                ? projects.map((p) => ({ label: p.name, value: p.id }))
                                : [{ label: "No projects created", value: "" }]
                        }
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <Input
                            placeholder="Filter board tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 text-xs h-9 w-48"
                        />
                    </div>
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
                        className="text-xs h-9 w-36"
                    />
                </div>
            </div>

            {/* Kanban Columns Grid */}
            {wsLoading || loadingBoard ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            ) : !activeProject ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
                    Please select or create a project to view the Kanban board.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[600px]">
                    <KanbanColumn
                        title="To Do"
                        status="TODO"
                        tasks={filteredBoard.TODO}
                        colorAccent="bg-gray-400"
                        onUpdate={fetchBoard}
                        onSelectTask={handleSelectTask}
                        onAddTask={() => setCreateTaskOpen(true)}
                    />
                    <KanbanColumn
                        title="In Progress"
                        status="IN_PROGRESS"
                        tasks={filteredBoard.IN_PROGRESS}
                        colorAccent="bg-blue-500"
                        onUpdate={fetchBoard}
                        onSelectTask={handleSelectTask}
                        onAddTask={() => setCreateTaskOpen(true)}
                    />
                    <KanbanColumn
                        title="In Review"
                        status="IN_REVIEW"
                        tasks={filteredBoard.IN_REVIEW}
                        colorAccent="bg-amber-500"
                        onUpdate={fetchBoard}
                        onSelectTask={handleSelectTask}
                        onAddTask={() => setCreateTaskOpen(true)}
                    />
                    <KanbanColumn
                        title="Done"
                        status="DONE"
                        tasks={filteredBoard.DONE}
                        colorAccent="bg-emerald-500"
                        onUpdate={fetchBoard}
                        onSelectTask={handleSelectTask}
                        onAddTask={() => setCreateTaskOpen(true)}
                    />
                </div>
            )}

            {/* Modals & Detail Sheet */}
            <CreateTaskModal open={isCreateTaskOpen} onOpenChange={setCreateTaskOpen} onSuccess={fetchBoard} />
            <TaskDetailSheet
                task={selectedTask}
                open={isDetailSheetOpen}
                onOpenChange={setDetailSheetOpen}
                onUpdate={fetchBoard}
            />
        </div>
    );
}
