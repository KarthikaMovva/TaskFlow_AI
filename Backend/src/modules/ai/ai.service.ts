import prisma from "../../config/prisma";

import {
    AIAnalysisContext,
    AIReport
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

import {
    generateNarrative
} from "./ai.narrative";

import {
    buildAIReport
} from "./ai.report";

import {
    buildProjectAnalysisPrompt
} from "./ai.prompt";

import aiClient
    from "./ai.llm";

import {
    buildDashboard
} from "./ai.dashboard";

import {
    buildAINotifications
} from "./ai.notification";

import {
    createNotification,
    notificationExists
} from "../notification/notification.service";


class AIService {


    /**
     * Build all data required for AI analysis.
     */
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


    /**
     * Get rule-based AI project insights.
     */
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


    /**
     * Generate complete AI project analysis.
     */
    async generateProjectAnalysis(
        projectId: string,
        userId: string
    ) {

        const context =
            await this.buildContext(
                projectId,
                userId
            );


        /**
         * Build the complete AI report.
         */
        const report =
            buildAIReport(context);


        /**
         * Normalize optional report fields so the
         * AIReport contract is always satisfied.
         */
        const analysis: AIReport = {

            ...report,

            risks:
                report.risks ?? [],

            workload:
                report.workload ?? [],

            recommendations:
                report.recommendations ?? [],

            narrative:
                report.narrative?.toString() ?? "",

            aiSummary:
                report.narrative?.toString() ?? ""

        };


        const notifications =
            buildAINotifications(context);


        /**
         * Build LLM prompt.
         */
        const prompt =
            buildProjectAnalysisPrompt(
                analysis
            );


        /**
         * Generate AI explanation.
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


            /**
             * Preserve the rule-based analysis
             * when the external AI provider fails.
             */
            analysis.aiSummary =
                "AI explanation unavailable. Using rule-based analysis.";

        }


        /**
         * Validate project health before
         * saving the analysis to history.
         */
        const health =
            analysis.overview.health;


        if (!health) {

            throw new Error(
                "Project health information is unavailable"
            );

        }


        /**
         * Save generated analysis history.
         */
        await aiHistoryService.saveHistory(

            userId,

            projectId,

            health.score,

            health.health,

            {
                projectId
            },

            analysis

        );


        /**
         * Create notifications.
         */
        for (
            const notification
            of notifications
        ) {

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

                title:
                    notification.title,

                message:
                    notification.message,

                userId

            });

        }


        return analysis;

    }


    /**
     * Get project AI trend.
     */
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

                    createdAt:
                        "desc"

                },

                take: 2,

                select: {

                    score: true,

                    health: true,

                    createdAt: true

                }

            });


        return analyzeTrend(
            history
        );

    }


    /**
     * Get AI dashboard information.
     */
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

                    createdAt:
                        "desc"

                },

                select: {

                    createdAt: true

                }

            });


        return buildDashboard(

            context,

            trend,

            latest?.createdAt ??
            null

        );

    }

}


export default new AIService();
