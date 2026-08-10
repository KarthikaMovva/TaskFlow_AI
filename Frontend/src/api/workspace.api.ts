import api from "./client";
import { Workspace } from "@/src/types";

export const workspaceApi = {
    create: async (name: string, organizationId: string): Promise<Workspace> => {
        const response = await api.post<{ success: boolean; workspace: Workspace }>("/workspaces", { name, organizationId });
        return response.data.workspace;
    },

    getByOrganization: async (organizationId: string): Promise<Workspace[]> => {
        const response = await api.get<{ success: boolean; workspaces: Workspace[] }>(`/workspaces/organization/${organizationId}`);
        return response.data.workspaces || [];
    },

    getById: async (workspaceId: string): Promise<Workspace> => {
        const response = await api.get<{ success: boolean; workspace: Workspace }>(`/workspaces/${workspaceId}`);
        return response.data.workspace;
    },

    update: async (workspaceId: string, name: string): Promise<Workspace> => {
        const response = await api.patch<{ success: boolean; workspace: Workspace }>(`/workspaces/${workspaceId}`, { name });
        return response.data.workspace;
    },

    delete: async (workspaceId: string): Promise<void> => {
        await api.delete(`/workspaces/${workspaceId}`);
    },
};
