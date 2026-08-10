import api from "./client";
import { KanbanBoardData } from "@/src/types";

export const kanbanApi = {
    getBoard: async (projectId: string): Promise<KanbanBoardData> => {
        const response = await api.get<{ success: boolean; board: KanbanBoardData }>(`/kanban/${projectId}`);
        return response.data.board;
    },
};
