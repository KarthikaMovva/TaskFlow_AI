import { AIAnalysisContext } from "./ai.types";

function generateHealthSection(
    context: AIAnalysisContext
): string {
    return `The project is currently in ${context.health.health} health with a score of ${context.health.score}/100.`;
}

function generateSummarySection(
    context: AIAnalysisContext
): string {

    const summary = context.summary;

    return `The project contains ${summary.totalTasks} tasks. ${summary.completed} have been completed, ${summary.inProgress} are in progress, ${summary.todo} are pending, and ${summary.review} are awaiting review. The overall completion rate is ${summary.completionRate}%.`;

}

function generateRiskSection(
    context: AIAnalysisContext
): string {

    if (context.risks.length === 0) {

        return "No significant project risks were detected.";

    }

    const critical = context.risks
        .slice(0, 3)
        .map(risk => risk.title)
        .join(", ");

    return `The analysis detected ${context.risks.length} high-risk tasks. The most critical include ${critical}.`;

}

function generateWorkloadSection(
    context: AIAnalysisContext
): string {

    if (context.workload.length === 0) {

        return "No workload information is available.";

    }

    const highest = context.workload[0];

    return `${highest.userName} currently has the highest workload with ${highest.totalTasks} assigned tasks (${highest.activeTasks} active).`;

}

function generateRecommendationSection(
    context: AIAnalysisContext
): string {

    if (context.recommendations.length === 0) {

        return "No recommendations are currently required.";

    }

    const messages = context.recommendations
        .map(recommendation => recommendation.message)
        .join(" ");

    return `Recommended next steps: ${messages}`;

}

export function generateNarrative(
    context: AIAnalysisContext
): string {

    const sections = [

        generateHealthSection(context),

        generateSummarySection(context),

        generateRiskSection(context),

        generateWorkloadSection(context),

        generateRecommendationSection(context)

    ];

    return sections.join(" ");

}