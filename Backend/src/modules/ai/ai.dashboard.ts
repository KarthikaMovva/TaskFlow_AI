import { AIAnalysisContext } from "./ai.types";

export function buildDashboard(
    context: AIAnalysisContext,
    trend: unknown,
    lastAnalysis: Date | null
) {

    const highRisks =
        context.risks?.filter(
            risk => risk.riskLevel === "HIGH"
        ).length ?? 0;

    const mediumRisks =
        context.risks?.filter(
            risk => risk.riskLevel === "MEDIUM"
        ).length ?? 0;

    const overloadedMembers =
        context.workload?.filter(
            user => user.workloadStatus === "OVERLOADED"
        ).length ?? 0;

    return {

        project: {

            id: context.project.id,

            name: context.project.name,

            status: context.project.status

        },

        overview: {

            health: context.health?.health,

            score: context.health?.score,

            completionRate:
                context.summary?.completionRate

        },

        risks: {

            total:
                context.risks?.length ?? 0,

            high: highRisks,

            medium: mediumRisks

        },

        workload: {

            members:
                context.workload?.length ?? 0,

            overloaded:
                overloadedMembers

        },

        recommendations:
            context.recommendations?.length ?? 0,

        trend,

        lastAnalysis

    };

}