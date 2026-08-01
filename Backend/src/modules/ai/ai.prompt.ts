import {
    AIReport
} from "./ai.types";


export function buildProjectAnalysisPrompt(
    report: AIReport
): string {


    return `

You are an AI project management assistant.

Analyze the following project health report and generate an executive summary.

Your response should:

1. Explain the current project health.
2. Identify the main causes of problems.
3. Explain major risks.
4. Suggest actionable next steps.

Keep the response concise and suitable for an engineering manager.

Project Information:

Project Name:
${report.project.name}

Project Status:
${report.project.status}


Health:

Status:
${report.overview.health.health}

Score:
${report.overview.health.score}/100


Summary:

Total Tasks:
${report.overview.summary.totalTasks}

Completed:
${report.overview.summary.completed}

In Progress:
${report.overview.summary.inProgress}

Todo:
${report.overview.summary.todo}

Review:
${report.overview.summary.review}

Completion Rate:
${report.overview.summary.completionRate}%


Major Risks:

${report.risks
            .map(
                risk =>
                    `
Task:
${risk.title}

Risk Level:
${risk.riskLevel}

Reasons:
${risk.reasons.join(", ")}
`
            )
            .join("\n")}


Recommendations:

${report.recommendations
            .map(
                recommendation =>
                    `
${recommendation.priority}:
${recommendation.message}
`
            )
            .join("\n")}


Generate only the final executive summary.

`;

}