"use client";

import React from "react";
import { Task, TaskStatus } from "@/src/types";
import KanbanCard from "./kanban-card";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    colorAccent: string;
    onUpdate: () => void;
    onSelectTask: (task: Task) => void;
    onAddTask: () => void;
}

export default function KanbanColumn({
    title,
    status,
    tasks,
    colorAccent,
    onUpdate,
    onSelectTask,
    onAddTask,
}: KanbanColumnProps) {
    return (
        <div className="flex h-full w-full min-w-[280px] flex-col rounded-2xl border border-gray-200/80 bg-gray-50/50 p-4 shadow-xs">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 mb-4">
                <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${colorAccent}`} />
                    <h3 className="font-bold text-gray-900 text-sm tracking-tight">{title}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-gray-600 border border-gray-200 shadow-2xs">
                        {tasks.length}
                    </span>
                </div>
                <button
                    onClick={onAddTask}
                    className="rounded-lg p-1 text-gray-400 hover:bg-purple-100 hover:text-purple-700 transition"
                    title="Add task to column"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Column Tasks Scrollable Area */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {tasks.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/40 text-center text-xs text-gray-400">
                        No tasks in {title.toLowerCase()}
                    </div>
                ) : (
                    tasks.map((task) => (
                        <KanbanCard
                            key={task.id}
                            task={task}
                            onUpdate={onUpdate}
                            onClick={() => onSelectTask(task)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
