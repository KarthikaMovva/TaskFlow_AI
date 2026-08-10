import api from "./client";
import { Task, TaskStatus, Priority } from "@/src/types";

export interface CreateTaskDTO {
    title: string;
    description?: string;
    projectId: string;
    assignedToId?: string;
    priority?: Priority;
    status?: TaskStatus;
    dueDate?: string;
    position?: number;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    assignedToId?: string | null;
    dueDate?: string | null;
    position?: number;
}

export const taskApi = {
    create: async (data: CreateTaskDTO): Promise<Task> => {
        const response = await api.post<{ success: boolean; task: Task }>("/tasks", data);
        return response.data.task;
    },

    getByProject: async (projectId: string): Promise<Task[]> => {
        const response = await api.get<{ success: boolean; tasks: Task[] }>(`/tasks/project/${projectId}`);
        return response.data.tasks || [];
    },

    getById: async (taskId: string): Promise<Task> => {
        const response = await api.get<{ success: boolean; task: Task }>(`/tasks/${taskId}`);
        return response.data.task;
    },

    update: async (taskId: string, data: UpdateTaskDTO): Promise<Task> => {
        const response = await api.patch<{ success: boolean; task: Task }>(`/tasks/${taskId}`, data);
        return response.data.task;
    },

    delete: async (taskId: string): Promise<void> => {
        await api.delete(`/tasks/${taskId}`);
    },

    assign: async (taskId: string, assignedToId: string | null): Promise<Task> => {
        const response = await api.patch<{ success: boolean; task: Task }>(`/tasks/${taskId}/assign`, { assignedToId });
        return response.data.task;
    },

    reorder: async (projectId: string, tasks: Array<{ id: string; position: number; status?: TaskStatus }>): Promise<void> => {
        await api.patch(`/tasks/project/${projectId}/reorder`, { tasks });
    },
};
