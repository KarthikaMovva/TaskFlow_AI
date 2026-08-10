"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useWorkspace } from "@/src/context/workspace-context";
import { projectApi } from "@/src/api/project.api";
import { ProjectStatus } from "@/src/types";
import toast from "react-hot-toast";

interface CreateProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function CreateProjectModal({ open, onOpenChange, onSuccess }: CreateProjectModalProps) {
    const { activeWorkspace, refreshProjects } = useWorkspace();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<ProjectStatus>("PLANNING");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Project name is required");
            return;
        }
        if (!activeWorkspace) {
            toast.error("No active workspace selected");
            return;
        }

        setIsSubmitting(true);
        try {
            await projectApi.create({
                name: name.trim(),
                description: description.trim() || undefined,
                workspaceId: activeWorkspace.id,
                status,
            });
            toast.success("Project created successfully");
            setName("");
            setDescription("");
            setStatus("PLANNING");
            onOpenChange(false);
            await refreshProjects();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create project");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onClose={() => onOpenChange(false)}>
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-700">Project Name *</label>
                        <Input
                            placeholder="e.g. AI Search Integration"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-700">Description</label>
                        <Textarea
                            placeholder="Describe project objectives and milestones..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-700">Initial Status</label>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                            options={[
                                { label: "Planning", value: "PLANNING" },
                                { label: "Active", value: "ACTIVE" },
                                { label: "Completed", value: "COMPLETED" },
                                { label: "Archived", value: "ARCHIVED" },
                            ]}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-700 hover:bg-purple-800" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
