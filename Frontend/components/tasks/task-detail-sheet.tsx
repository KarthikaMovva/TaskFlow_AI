"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, MessageSquare, Send, Trash2, CheckCircle2 } from "lucide-react";
import { Task, Comment, Priority, TaskStatus } from "@/src/types";
import { taskApi } from "@/src/api/task.api";
import { commentApi } from "@/src/api/comment.api";
import toast from "react-hot-toast";

interface TaskDetailSheetProps {
    task: Task | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export default function TaskDetailSheet({ task, open, onOpenChange, onUpdate }: TaskDetailSheetProps) {
    if (!task) return null;

    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [priority, setPriority] = useState<Priority>(task.priority);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const fetchComments = async () => {
        try {
            const list = await commentApi.getByTask(task.id);
            setComments(list);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    useEffect(() => {
        if (task) {
            setStatus(task.status);
            setPriority(task.priority);
            fetchComments();
        }
    }, [task?.id]);

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
            <SheetContent className="sm:max-w-md w-full overflow-y-auto space-y-6">
                <SheetHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800">{task.project?.name || "Project Task"}</Badge>
                    </div>
                    <SheetTitle className="text-xl font-bold text-gray-900 mt-2">{task.title}</SheetTitle>
                </SheetHeader>

                {/* Status & Priority Selectors */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50/70 p-3 rounded-xl border border-gray-200/60">
                    <div>
                        <label className="text-[11px] font-semibold text-gray-500 uppercase">Status</label>
                        <Select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                            options={[
                                { label: "To Do", value: "TODO" },
                                { label: "In Progress", value: "IN_PROGRESS" },
                                { label: "In Review", value: "IN_REVIEW" },
                                { label: "Done", value: "DONE" },
                            ]}
                            className="mt-1 text-xs"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-semibold text-gray-500 uppercase">Priority</label>
                        <Select
                            value={priority}
                            onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                            options={[
                                { label: "Low", value: "LOW" },
                                { label: "Medium", value: "MEDIUM" },
                                { label: "High", value: "HIGH" },
                                { label: "Urgent", value: "URGENT" },
                            ]}
                            className="mt-1 text-xs"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Description</h4>
                    <div className="rounded-xl border border-gray-200/80 bg-white p-3 text-xs text-gray-700 leading-relaxed min-h-[80px]">
                        {task.description || "No description provided."}
                    </div>
                </div>

                {/* Task Metadata */}
                <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Created by</span>
                        <span className="font-semibold text-gray-900">{task.createdBy?.name || "System"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Assignee</span>
                        <span className="font-semibold text-purple-700">{task.assignedTo?.name || "Unassigned"}</span>
                    </div>
                    {task.dueDate && (
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Due Date</span>
                            <span className="font-semibold text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="space-y-4 border-t border-gray-100 pt-4">
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <MessageSquare size={16} className="text-purple-700" />
                        Comments ({comments.length})
                    </h4>

                    {/* New Comment Input */}
                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <Input
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="text-xs"
                        />
                        <Button type="submit" size="sm" className="bg-purple-700 hover:bg-purple-800" disabled={isSubmittingComment}>
                            <Send size={14} />
                        </Button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {comments.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 py-4">No comments yet</p>
                        ) : (
                            comments.map((c) => (
                                <div key={c.id} className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 space-y-1 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900">{c.user?.name || "User"}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
                                            <button onClick={() => handleDeleteComment(c.id)} className="text-gray-400 hover:text-red-600">
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
