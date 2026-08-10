"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useWorkspace } from "@/src/context/workspace-context";
import { taskApi } from "@/src/api/task.api";
import { Priority, TaskStatus } from "@/src/types";
import toast from "react-hot-toast";

interface CreateTaskModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId?: string;
    onSuccess?: () => void;
}

export default function CreateTaskModal({ open, onOpenChange, projectId: propProjectId, onSuccess }: CreateTaskModalProps) {
    const { projects, activeProject } = useWorkspace();

    const selectedProjectId = propProjectId || (activeProject ? activeProject.id : projects[0]?.id || "");

    const [projectId, setProjectId] = useState(selectedProjectId);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("MEDIUM");
    const [status, setStatus] = useState<TaskStatus>("TODO");
    const [dueDate, setDueDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (selectedProjectId) {
            setProjectId(selectedProjectId);
        }
    }, [selectedProjectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Task title is required");
            return;
        }
        if (!projectId) {
            toast.error("Please select a target project");
            return;
        }

        setIsSubmitting(true);
        try {
            await taskApi.create({
                title: title.trim(),
                description: description.trim() || undefined,
                projectId,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                position: Date.now(),
            });
            toast.success("Task created successfully");
            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setStatus("TODO");
            setDueDate("");
            onOpenChange(false);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create task");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onClose={() => onOpenChange(false)}>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {!propProjectId && projects.length > 0 && (
                        <div>
                            <label className="text-xs font-semibold text-gray-700">Select Project *</label>
                            <Select
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                options={projects.map((p) => ({ label: p.name, value: p.id }))}
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-semibold text-gray-700">Task Title *</label>
                        <Input
                            placeholder="e.g. Implement JWT Refresh Interceptor"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700">Description</label>
                        <Textarea
                            placeholder="Add task specifications and context..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700">Priority</label>
                            <Select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Priority)}
                                options={[
                                    { label: "Low", value: "LOW" },
                                    { label: "Medium", value: "MEDIUM" },
                                    { label: "High", value: "HIGH" },
                                    { label: "Urgent", value: "URGENT" },
                                ]}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700">Initial Status</label>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                options={[
                                    { label: "To Do", value: "TODO" },
                                    { label: "In Progress", value: "IN_PROGRESS" },
                                    { label: "In Review", value: "IN_REVIEW" },
                                    { label: "Done", value: "DONE" },
                                ]}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-700">Due Date</label>
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-700 hover:bg-purple-800" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
