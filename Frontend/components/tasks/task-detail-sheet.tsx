"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, MessageSquare, Send, Trash2, UserRoundCheck } from "lucide-react";
import { Task, Comment, Priority, TaskStatus, User as UserType, WorkspaceMember } from "@/src/types";
import { taskApi } from "@/src/api/task.api";
import { commentApi } from "@/src/api/comment.api";
import { workspaceApi } from "@/src/api/workspace.api";
import { useWorkspace } from "@/src/context/workspace-context";
import toast from "react-hot-toast";

interface TaskDetailSheetProps {
    task: Task | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export default function TaskDetailSheet({ task, open, onOpenChange, onUpdate }: TaskDetailSheetProps) {
    const { activeWorkspace } = useWorkspace();
    const [status, setStatus] = useState<TaskStatus>("TODO");
    const [priority, setPriority] = useState<Priority>("MEDIUM");
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [members, setMembers] = useState<WorkspaceMember[]>([]);
    const [assignedTo, setAssignedTo] = useState<UserType | null>(null);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        if (!task) {
            setComments([]);
            return;
        }

        setStatus(task.status);
        setPriority(task.priority);
        setAssignedTo(task.assignedTo ?? null);

        const loadComments = async () => {
            try {
                const list = await commentApi.getByTask(task.id);
                setComments(list);
            } catch (err) {
                console.error("Failed to load comments", err);
            }
        };

        void loadComments();
    }, [task?.id]);

    useEffect(() => {
        if (!task || !activeWorkspace) {
            setMembers([]);
            return;
        }

        const loadMembers = async () => {
            setIsLoadingMembers(true);
            try {
                const workspaceMembers = await workspaceApi.getMembers(activeWorkspace.id);
                setMembers(workspaceMembers);
            } catch (err) {
                console.error("Failed to load workspace members", err);
                toast.error("Failed to load workspace members");
            } finally {
                setIsLoadingMembers(false);
            }
        };

        void loadMembers();
    }, [task?.id, activeWorkspace?.id]);

    if (!task) return null;

    const fetchComments = async () => {
        try {
            const list = await commentApi.getByTask(task.id);
            setComments(list);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    const handleStatusChange = async (newStatus: TaskStatus) => {
        setStatus(newStatus);
        try {
            await taskApi.update(task.id, { status: newStatus });
            toast.success("Status updated");
            onUpdate();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handlePriorityChange = async (newPriority: Priority) => {
        setPriority(newPriority);
        try {
            await taskApi.update(task.id, { priority: newPriority });
            toast.success("Priority updated");
            onUpdate();
        } catch (err) {
            toast.error("Failed to update priority");
        }
    };

    const handleAssigneeChange = async (value: string) => {
        const assignedToId = value === "unassigned" ? null : value;
        const selectedMember = assignedToId
            ? members.find((member) => member.userId === assignedToId)
            : undefined;

        if (assignedToId && !selectedMember?.user) {
            toast.error("Select a member from this workspace");
            return;
        }

        setIsAssigning(true);
        try {
            await taskApi.assign(task.id, assignedToId);
            setAssignedTo(selectedMember?.user ?? null);
            toast.success(assignedToId ? "Assignee updated" : "Task unassigned");
            onUpdate();
        } catch (err) {
            toast.error("Failed to update assignee");
        } finally {
            setIsAssigning(false);
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        try {
            await commentApi.create(task.id, newComment.trim());
            setNewComment("");
            toast.success("Comment added");
            await fetchComments();
        } catch (err) {
            toast.error("Failed to post comment");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await commentApi.delete(commentId);
            toast.success("Comment deleted");
            await fetchComments();
        } catch (err) {
            toast.error("Failed to delete comment");
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full space-y-6 overflow-y-auto bg-gray-50/50 p-5 sm:max-w-lg sm:p-6">
                <SheetHeader className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800">{task.project?.name || "Project Task"}</Badge>
                    </div>
                    <SheetTitle className="mt-2 text-xl font-bold leading-tight text-gray-900">{task.title}</SheetTitle>
                </SheetHeader>

                {/* Status & Priority Selectors */}
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Status</label>
                        <Select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                            options={[
                                { label: "To Do", value: "TODO" },
                                { label: "In Progress", value: "IN_PROGRESS" },
                                { label: "In Review", value: "IN_REVIEW" },
                                { label: "Done", value: "DONE" },
                            ]}
                            aria-label="Task status"
                            className="mt-1 text-xs"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Priority</label>
                        <Select
                            value={priority}
                            onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                            options={[
                                { label: "Low", value: "LOW" },
                                { label: "Medium", value: "MEDIUM" },
                                { label: "High", value: "HIGH" },
                                { label: "Urgent", value: "URGENT" },
                            ]}
                            aria-label="Task priority"
                            className="mt-1 text-xs"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</h4>
                    <div className="min-h-[72px] text-sm leading-relaxed text-gray-700">
                        {task.description || "No description provided."}
                    </div>
                </div>

                {/* Task Metadata */}
                <div className="space-y-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Details</h4>
                    <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="flex items-center gap-2 text-gray-500"><User size={15} />Created by</span>
                        <span className="font-semibold text-gray-900">{task.createdBy?.name || "System"}</span>
                    </div>
                    <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-3">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-700">
                            <UserRoundCheck size={15} /> Assignee
                        </div>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-purple-200">
                                <AvatarFallback className="bg-purple-100 text-xs font-bold text-purple-700">
                                    {assignedTo ? getInitials(assignedTo.name) : <User size={14} />}
                                </AvatarFallback>
                            </Avatar>
                            <Select
                                value={assignedTo?.id || "unassigned"}
                                onChange={(e) => handleAssigneeChange(e.target.value)}
                                disabled={isLoadingMembers || isAssigning || !activeWorkspace}
                                aria-label="Assign task to a workspace member"
                                options={[
                                    { label: isLoadingMembers ? "Loading members..." : "Unassigned", value: "unassigned" },
                                    ...members
                                        .filter((member) => member.user)
                                        .map((member) => ({
                                            label: `${member.user!.name} (${member.role.toLowerCase()})`,
                                            value: member.userId,
                                        })),
                                ]}
                                className="h-9 flex-1 border-purple-200 bg-white text-xs focus:border-purple-600"
                            />
                        </div>
                    </div>
                    {task.dueDate && (
                        <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="flex items-center gap-2 text-gray-500"><Calendar size={15} />Due date</span>
                            <span className="font-semibold text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="space-y-4 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <MessageSquare size={16} className="text-purple-700" />
                        Comments ({comments.length})
                    </h4>

                    {/* New Comment Input */}
                    <form onSubmit={handleAddComment} className="flex gap-2 border-t border-gray-100 pt-4">
                        <Input
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            aria-label="Add a comment"
                            className="text-xs"
                        />
                        <Button type="submit" size="sm" className="bg-purple-700 hover:bg-purple-800" disabled={isSubmittingComment} aria-label="Post comment">
                            <Send size={14} />
                        </Button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {comments.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 py-4">No comments yet</p>
                        ) : (
                            comments.map((c) => (
                                <div key={c.id} className="space-y-1 rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900">{c.user?.name || "User"}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
                                            <button onClick={() => handleDeleteComment(c.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20" aria-label="Delete comment">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-normal">{c.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
