import { AIAnalysisContext } from "./ai.types";

function generateHealthSection(
    context: AIAnalysisContext
): string {
    const health = context.health;

    if (!health) {
        return "Project health information is currently unavailable.";
    }

    return `The project is currently in ${health.health} health with a score of ${health.score}/100.`;
}


function generateSummarySection(
    context: AIAnalysisContext
): string {

    const summary = context.summary;

    if (!summary) {
        return "Project summary information is currently unavailable.";
    }

    return `The project contains ${summary.totalTasks} tasks. ${summary.completed} have been completed, ${summary.inProgress} are in progress, ${summary.todo} are pending, and ${summary.review} are awaiting review. The overall completion rate is ${summary.completionRate}%.`;
}


function generateRiskSection(
    context: AIAnalysisContext
): string {

    const risks = context.risks ?? [];

    if (risks.length === 0) {
        return "No significant project risks were detected.";
    }

    const critical = risks
        .slice(0, 3)
        .map(risk => risk.title)
        .join(", ");

    return `The analysis detected ${risks.length} high-risk tasks. The most critical include ${critical}.`;
}


function generateWorkloadSection(
    context: AIAnalysisContext
): string {

    const workload = context.workload ?? [];

    if (workload.length === 0) {
        return "No workload information is available.";
    }

    const highest = workload[0];

    return `${highest.userName} currently has the highest workload with ${highest.totalTasks} assigned tasks (${highest.activeTasks} active).`;
}


function generateRecommendationSection(
    context: AIAnalysisContext
): string {

    const recommendations = context.recommendations ?? [];

    if (recommendations.length === 0) {
        return "No recommendations are currently required.";
    }

    const messages = recommendations
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