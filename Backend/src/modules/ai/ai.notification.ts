import { AIAnalysisContext } from "./ai.types";

export interface AINotification {

    title: string;

    message: string;

    severity: "INFO" | "WARNING" | "CRITICAL";

}

export function buildAINotifications(

    context: AIAnalysisContext

): AINotification[] {

    const notifications: AINotification[] = [];

    /*
        Health
    */

    if (

        context.health?.health === "CRITICAL"

    ) {

        notifications.push({

            title: "Critical Project Health",

            message:
                `Project "${context.project.name}" requires immediate attention.`,

            severity: "CRITICAL"

        });

    }

    /*
        Risks
    */

    if (

        context.risks &&
        context.risks.length >= 5

    ) {

        notifications.push({

            title: "High Risk Tasks Detected",

            message:
                `${context.risks.length} high-risk tasks were identified.`,

            severity: "WARNING"

        });

    }

    /*
        Workload
    */

    const overloaded =

        context.workload?.filter(

            user =>
                user.workloadStatus ===
                "OVERLOADED"

        );

    if (

        overloaded &&
        overloaded.length > 0

    ) {

        notifications.push({

            title: "Workload Imbalance",

            message:
                `${overloaded.length} team member(s) are overloaded.`,

            severity: "WARNING"

        });

    }

    return notifications;

}