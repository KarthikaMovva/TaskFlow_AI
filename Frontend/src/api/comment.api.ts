import api from "./client";
import { Comment } from "@/src/types";

export const commentApi = {
    create: async (taskId: string, message: string): Promise<Comment> => {
        const response = await api.post<{ success: boolean; comment: Comment }>(`/comments/tasks/${taskId}/comments`, { message });
        return response.data.comment;
    },

    getByTask: async (taskId: string): Promise<Comment[]> => {
        const response = await api.get<{ success: boolean; comments: Comment[] }>(`/comments/tasks/${taskId}/comments`);
        return response.data.comments || [];
    },

    update: async (commentId: string, message: string): Promise<Comment> => {
        const response = await api.patch<{ success: boolean; comment: Comment }>(`/comments/${commentId}`, { message });
        return response.data.comment;
    },

    delete: async (commentId: string): Promise<void> => {
        await api.delete(`/comments/${commentId}`);
    },
};
