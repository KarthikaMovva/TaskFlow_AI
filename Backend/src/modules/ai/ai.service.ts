import prisma from "../../config/prisma";
import {
    AIAnalysisContext
} from "./ai.types";
import {
    buildSummary,
    calculateHealth,
    findHighRiskTasks,
    calculateWorkload,
    generateRecommendations,
    analyzeTrend
} from "./ai.utils";
import aiHistoryService
    from "./ai.history.service";
import { generateNarrative } from "./ai.narrative";
import {
    buildAIReport
} from "./ai.report";
import {
    buildProjectAnalysisPrompt
}
    from "./ai.prompt";
import aiClient
    from "./ai.llm";
import { buildDashboard }
    from "./ai.dashboard";
import { buildAINotifications }
    from "./ai.notification";

import {
    createNotification,
    notificationExists
}
    from "../notification/notification.service";



class AIService {

    private async buildContext(

        projectId: string,

        userId: string

    ): Promise<AIAnalysisContext> {

        const project =
            await prisma.project.findUnique({

                where: {

                    id: projectId

                }

            });

        if (!project) {

            throw new Error(
                "Project not found"
            );

        }

        const membership =
            await prisma.workspaceMember.findUnique({

                where: {

                    userId_workspaceId: {

                        userId,

                        workspaceId:
                            project.workspaceId

                    }

                }

            });

        if (!membership) {

            throw new Error(
                "You are not a member of this workspace"
            );

        }

        const tasks =
            await prisma.task.findMany({

                where: {

                    projectId

                },

                include: {

                    assignedTo: true,

                    comments: true

                }

            });

        const context: AIAnalysisContext = {

            project,

            tasks,

            summary:
                buildSummary(tasks),

            generatedAt:
                new Date()

        };

        context.health =
            calculateHealth(context);

        context.risks =
            findHighRiskTasks(context);

        context.workload =
            calculateWorkload(context);

        context.recommendations =
            generateRecommendations(context);

        context.narrative =
            generateNarrative(context);

        return context;

    }

    async getProjectInsights(

        projectId: string,

        userId: string

    ) {

        const context =
            await this.buildContext(

                projectId,

                userId

            );

        return buildAIReport(
            context
        );

    }
    async generateProjectAnalysis(

        projectId: string,

        userId: string

    ) {

        const context =
            await this.buildContext(
                projectId,
                userId
            );

        const analysis =
            buildAIReport(context);
        const notifications =
            buildAINotifications(context);


        /*
            Build LLM prompt
        */

        const prompt =
            buildProjectAnalysisPrompt(
                analysis
            );


        /*
            Generate AI explanation
        */

        try {

            const aiSummary =
                await aiClient.generateAIExplanation(
                    prompt
                );



            analysis.aiSummary =

                aiSummary ??
                analysis.narrative;


        }
        catch (error) {

            console.error(
                "Gemini failed:",
                error
            );


            analysis.aiSummary =
                "AI explanation unavailable. Using rule-based analysis.";

        }



        await aiHistoryService.saveHistory(

            userId,

            projectId,

            analysis.overview.health.score,

            analysis.overview.health.health,

            {
                projectId
            },

            analysis

        );

        for (const notification of notifications) {

            const exists =
                await notificationExists(

                    userId,

                    notification.title,

                    notification.message

                );

            if (exists) {

                continue;

            }

            await createNotification({

                title: notification.title,

                message: notification.message,

                userId

            });

        }


        return analysis;

    }

    async getProjectTrend(
        projectId: string,
        userId: string
    ) {


        const project =
            await prisma.project.findUnique({
                where: {
                    id: projectId
                }
            });



        if (!project) {
            throw new Error(
                "Project not found"
            );

        }



        const membership =
            await prisma.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId,
                        workspaceId:
                            project.workspaceId
                    }
                }
            });



        if (!membership) {
            throw new Error(
                "You are not a member of this workspace"
            );

        }



        const history =
            await prisma.aiHistory.findMany({
                where: {
                    projectId
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 2,
                select: {
                    score: true,
                    health: true,
                    createdAt: true
                }
            });
        return analyzeTrend(history);

    }
    async getDashboard(

        projectId: string,

        userId: string

    ) {

        const context =
            await this.buildContext(

                projectId,

                userId

            );

        const trend =
            await this.getProjectTrend(

                projectId,

                userId

            );

        const latest =
            await prisma.aiHistory.findFirst({

                where: {

                    projectId

                },

                orderBy: {

                    createdAt: "desc"

                },

                select: {

                    createdAt: true

                }

            });

        return buildDashboard(

            context,

            trend,

            latest?.createdAt ?? null

        );

    }

}


export default new AIService();