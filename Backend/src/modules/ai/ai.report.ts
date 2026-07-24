import {
    AIAnalysisContext
} from "./ai.types";


export function buildAIReport(
    context: AIAnalysisContext
) {

    return {
        project: {
            id:
                context.project.id,
            name:
                context.project.name,
            status:
                context.project.status
        },

        overview: {
            summary:
                context.summary,
            health:
                context.health
        },

        risks:
            context.risks,

        workload:
            context.workload,

        recommendations:
            context.recommendations,

        narrative:
            context.narrative,

        generatedAt:
            context.generatedAt
    };

}