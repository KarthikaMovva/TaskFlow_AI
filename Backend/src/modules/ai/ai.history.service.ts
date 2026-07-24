import prisma from "../../config/prisma";
import {
    AIType
} from "@prisma/client";


class AIHistoryService {


    async saveHistory(
        userId: string,
        projectId: string,
        score: number,
        health: string,
        input: unknown,
        output: unknown
    ) {
        const history =
            await prisma.aiHistory.create({
                data: {
                    userId,
                    projectId,
                    score,
                    health,
                    type: AIType.PROJECT_ANALYSIS,
                    input:
                        JSON.stringify(input),
                    output:
                        JSON.stringify(output)
                }

            });
        return history;

    }



    async getUserHistory(
        userId: string
    ) {


        const history =
            await prisma.aiHistory.findMany({
                where: {
                    userId
                },
                orderBy: {
                    createdAt: "desc"
                }

            });



        return history;

    }

    async getProjectHistory(
        projectId: string
    ) {

        return await prisma.aiHistory.findMany({
            where: {
                projectId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

    }

    async getUserAIHistory(
        userId: string
    ) {

        return await prisma.aiHistory.findMany({
            where: {
                userId
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },

            orderBy: {
                createdAt: "desc"
            }
        });
    }
}



export default new AIHistoryService();