import api from "./client";
import { Project, ProjectStatus } from "@/src/types";

export interface CreateProjectDTO {
    name: string;
    description?: string;
    workspaceId: string;
    status?: ProjectStatus;
}

export interface UpdateProjectDTO {
    name?: string;
    description?: string;
    status?: ProjectStatus;
}

export const projectApi = {
    create: async (data: CreateProjectDTO): Promise<Project> => {
        const response = await api.post<{ success: boolean; project: Project }>("/projects", data);
        return response.data.project;
    },

    getByWorkspace: async (workspaceId: string): Promise<Project[]> => {
        const response = await api.get<{ success: boolean; projects: Project[] }>(`/projects/workspace/${workspaceId}`);
        return response.data.projects || [];
    },

    getById: async (projectId: string): Promise<Project> => {
        const response = await api.get<{ success: boolean; project: Project }>(`/projects/${projectId}`);
        return response.data.project;
    },

    update: async (projectId: string, data: UpdateProjectDTO): Promise<Project> => {
        const response = await api.patch<{ success: boolean; project: Project }>(`/projects/${projectId}`, data);
        return response.data.project;
    },

    delete: async (projectId: string): Promise<void> => {
        await api.delete(`/projects/${projectId}`);
    },
};
