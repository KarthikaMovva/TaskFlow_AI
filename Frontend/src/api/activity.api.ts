import api from "./client";
import { Activity } from "@/src/types";

export const activityApi = {
    getByWorkspace: async (workspaceId: string): Promise<Activity[]> => {
        const response = await api.get<{ success: boolean; activities: Activity[] }>(`/activity/workspace/${workspaceId}`);
        return response.data.activities || [];
    },
};
