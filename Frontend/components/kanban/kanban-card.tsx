"use client";

import React from "react";
import axios from "axios";
import { Task, TaskStatus, Priority } from "@/src/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, AlertCircle, ChevronRight, ChevronLeft, MoreHorizontal, User, Trash2 } from "lucide-react";
import { taskApi } from "@/src/api/task.api";
import toast from "react-hot-toast";

interface KanbanCardProps {
    task: Task;
    onUpdate: () => void;
    onClick: () => void;
}

export default function KanbanCard({ task, onUpdate, onClick }: KanbanCardProps) {
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

    const handleShiftStatus = async (e: React.MouseEvent, nextStatus: TaskStatus) => {
        e.stopPropagation();
        try {
            await taskApi.update(task.id, { status: nextStatus });
            toast.success(`Task moved to ${nextStatus.replace("_", " ")}`);
            onUpdate();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleDeleteTask = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this task?")) return;
        try {
            await taskApi.delete(task.id);
            toast.success("Task deleted");
            onUpdate();
        } catch (err: unknown) {
            const serverMessage = axios.isAxiosError<{ message?: string }>(err)
                ? err.response?.data?.message
                : undefined;
            toast.error(serverMessage || "Failed to delete task");
        }
    };

    const getUserInitials = (name?: string) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <div
            onClick={onClick}
            className="group relative rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs hover:shadow-md hover:border-purple-200 transition cursor-pointer space-y-3"
        >
            {/* Title & Priority */}
            <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-purple-700 transition">
                    {task.title}
                </h4>
                {getPriorityBadge(task.priority)}
            </div>

            {/* Description snippet */}
            {task.description && (
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{task.description}</p>
            )}

            {/* Due date & Assignee Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                    {task.dueDate && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                            <Calendar size={12} className="text-purple-600" />
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {task.assignedTo ? (
                        <Avatar className="h-6 w-6 border border-purple-200">
                            <AvatarFallback className="bg-purple-100 text-[10px] font-bold text-purple-700">
                                {getUserInitials(task.assignedTo.name)}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400" title="Unassigned">
                            <User size={12} />
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions Bar on Hover */}
            <div className="flex items-center justify-between pt-2 opacity-80 group-hover:opacity-100 transition">
                <div className="flex items-center gap-1">
                    {task.status !== "TODO" && (
                        <button
                            onClick={(e) =>
                                handleShiftStatus(
                                    e,
                                    task.status === "DONE"
                                        ? "IN_REVIEW"
                                        : task.status === "IN_REVIEW"
                                        ? "IN_PROGRESS"
                                        : "TODO"
                                )
                            }
                            className="rounded-md p-1 text-gray-400 hover:bg-purple-50 hover:text-purple-700 transition"
                            title="Move Backward"
                        >
                            <ChevronLeft size={14} />
                        </button>
                    )}
                    {task.status !== "DONE" && (
                        <button
                            onClick={(e) =>
                                handleShiftStatus(
                                    e,
                                    task.status === "TODO"
                                        ? "IN_PROGRESS"
                                        : task.status === "IN_PROGRESS"
                                        ? "IN_REVIEW"
                                        : "DONE"
                                )
                            }
                            className="rounded-md p-1 text-gray-400 hover:bg-purple-50 hover:text-purple-700 transition"
                            title="Move Forward"
                        >
                            <ChevronRight size={14} />
                        </button>
                    )}
                </div>
                <button
                    onClick={handleDeleteTask}
                    className="rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete task"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    );
}
