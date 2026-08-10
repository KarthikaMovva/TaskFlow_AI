import api from "./client";
import { Notification } from "@/src/types";

export const notificationApi = {
    getAll: async (): Promise<Notification[]> => {
        const response = await api.get<{ success: boolean; notifications: Notification[] }>("/notifications");
        return response.data.notifications || [];
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<{ success: boolean; count: number }>("/notifications/unread-count");
        return response.data.count || 0;
    },

    markAsRead: async (notificationId: string): Promise<Notification> => {
        const response = await api.patch<{ success: boolean; notification: Notification }>(`/notifications/${notificationId}/read`);
        return response.data.notification;
    },

    markAllAsRead: async (): Promise<void> => {
        await api.patch("/notifications/read-all");
    },

    delete: async (notificationId: string): Promise<void> => {
        await api.delete(`/notifications/${notificationId}`);
    },
};
