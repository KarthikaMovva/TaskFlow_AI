import {
    TaskStatus,
    Priority
} from "@prisma/client";

import {
    TaskWithRelations,
    ProjectSummary,
    HealthAnalysis,
    AIAnalysisContext,
    TaskRisk,
    UserWorkload,
    AIRecommendation
} from "./ai.types";
import {
    PROJECT_HEALTH,
    HEALTH_PENALTIES,
    RISK_WEIGHTS,
    RISK_THRESHOLDS,
    WORKLOAD_THRESHOLDS
} from "./ai.constants";
import { compareHistory }
    from "./ai.history.analysis";



export function buildSummary(
    tasks: TaskWithRelations[]
): ProjectSummary {


    const totalTasks =
        tasks.length;



    const completed =
        tasks.filter(
            task =>
                task.status === TaskStatus.DONE
        ).length;



    const inProgress =
        tasks.filter(
            task =>
                task.status === TaskStatus.IN_PROGRESS
        ).length;



    const todo =
        tasks.filter(
            task =>
                task.status === TaskStatus.TODO
        ).length;



    const review =
        tasks.filter(
            task =>
                task.status === TaskStatus.IN_REVIEW
        ).length;



    const completionRate =
        totalTasks === 0
            ? 0
            : Math.round(
                (completed / totalTasks) * 100
            );



    return {
        totalTasks,
        completed,
        inProgress,
        todo,
        review,
        completionRate
    };


}

export function calculateHealth(
    context: AIAnalysisContext
): HealthAnalysis {
    let score = 100;
    const reasons: string[] = [];
    /*
        1. Check overdue tasks
    */

    const today = new Date();
    const overdueTasks =

        context.tasks.filter(task => {


            return (
                task.dueDate &&
                task.dueDate < today &&
                task.status !== "DONE"
            );


        });



    if (overdueTasks.length > 0) {
        const penalty =
            overdueTasks.length *
            HEALTH_PENALTIES.OVERDUE_TASK;
        score -= penalty;
        reasons.push(
            `${overdueTasks.length} overdue tasks`
        );

    }



    /*
        2. Completion rate analysis
    */


    const completionRate =
        context.summary?.completionRate ?? 0;



    if (completionRate < 30) {
        score -=
            HEALTH_PENALTIES.VERY_LOW_COMPLETION;
        reasons.push(
            "Very low completion rate"
        );


    }

    else if (completionRate < 50) {
        score -=
            HEALTH_PENALTIES.LOW_COMPLETION;

        reasons.push(
            "Low completion rate"
        );

    }



    /*
        Prevent negative score
    */

    score = Math.max(score, 0);



    /*
        Determine health
    */

    let health:
        HealthAnalysis["health"];
    const incompleteTasks =
        context.tasks.filter(
            task => task.status !== "DONE"
        ).length;


    if (incompleteTasks > 10) {
        score -= 10;
        reasons.push(
            "High number of incomplete tasks"
        );
    }


    if (score >= PROJECT_HEALTH.EXCELLENT) {
        health = "EXCELLENT";
    }

    else if (score >= PROJECT_HEALTH.GOOD) {
        health = "GOOD";
    }

    else if (score >= PROJECT_HEALTH.WARNING) {
        health = "WARNING";
    }

    else {
        health = "CRITICAL";
    }



    return {
        health,
        score,
        reasons
    };


}

export function calculateRiskScore(
    task: TaskWithRelations
): TaskRisk {


    let riskScore = 0;
    const reasons: string[] = [];
    const today = new Date();

    /*
        Overdue check
    */

    if (
        task.dueDate &&
        task.dueDate < today &&
        task.status !== TaskStatus.DONE
    ) {
        riskScore += RISK_WEIGHTS.OVERDUE;
        reasons.push(
            "Task is overdue"
        );

    }



    /*
        Priority check
    */

    if (task.priority === Priority.URGENT) {
        riskScore +=
            RISK_WEIGHTS.URGENT_PRIORITY;
        reasons.push(
            "Urgent priority task"
        );
    }


    else if (task.priority === Priority.HIGH) {
        riskScore +=
            RISK_WEIGHTS.HIGH_PRIORITY;
        reasons.push(
            "High priority task"
        );
    }


    else if (task.priority === Priority.MEDIUM) {
        riskScore +=
            RISK_WEIGHTS.MEDIUM_PRIORITY;
    }



    /*
        Stale task check
    */

    const daysSinceUpdate =
        Math.floor(
            (
                today.getTime()
                -
                task.createdAt.getTime()
            )
            /
            (
                1000 *
                60 *
                60 *
                24
            )
        );



    if (daysSinceUpdate > 7) {
        riskScore +=
            RISK_WEIGHTS.STALE_TASK;
        reasons.push(
            "No recent updates"
        );
    }



    /*
        Comment activity
    */

    if (task.comments.length > 5) {
        riskScore +=
            RISK_WEIGHTS.MANY_COMMENTS;
        reasons.push(
            "High discussion activity"
        );
    }



    riskScore =
        Math.min(riskScore, 100);



    let riskLevel:
        TaskRisk["riskLevel"];



    if (riskScore >= RISK_THRESHOLDS.CRITICAL) {
        riskLevel = "CRITICAL";
    }

    else if (riskScore >= RISK_THRESHOLDS.HIGH) {
        riskLevel = "HIGH";
    }

    else if (riskScore >= RISK_THRESHOLDS.MEDIUM) {
        riskLevel = "MEDIUM";
    }

    else {
        riskLevel = "LOW";
    }



    return {
        taskId: task.id,
        title: task.title,
        riskScore,
        riskLevel,
        reasons
    };


}

export function findHighRiskTasks(
    context: AIAnalysisContext
): TaskRisk[] {


    return context.tasks
        .map(task =>
            calculateRiskScore(task)
        )
        .filter(task =>
            task.riskScore >= 40
        );
}

export function calculateWorkload(
    context: AIAnalysisContext
): UserWorkload[] {


    const userMap =
        new Map<string, UserWorkload>();


    context.tasks.forEach(task => {
        if (!task.assignedTo) {

            return;

        }



        const userId =
            task.assignedTo.id;



        if (!userMap.has(userId)) {


            userMap.set(
                userId,
                {
                    userId,
                    userName:
                        task.assignedTo.name,
                    totalTasks: 0,
                    completedTasks: 0,
                    activeTasks: 0,
                    workloadStatus: "LIGHT",
                    reasons: []
                }

            );

        }



        const workload =
            userMap.get(userId)!;



        workload.totalTasks++;



        if (task.status === "DONE") {
            workload.completedTasks++;
        }
        else {
            workload.activeTasks++;
        }


    });



    const result =
        Array.from(userMap.values());



    result.forEach(user => {


        if (
            user.activeTasks >=
            WORKLOAD_THRESHOLDS.OVERLOAD_LIMIT
        ) {


            user.workloadStatus =
                "OVERLOADED";


            user.reasons.push(
                "Too many active tasks"
            );


        }


        else if (
            user.activeTasks <= 5
        ) {


            user.workloadStatus =
                "LIGHT";


        }


        else {


            user.workloadStatus =
                "NORMAL";


        }



        if (
            user.totalTasks > 0 &&
            user.completedTasks /
            user.totalTasks < 0.2
        ) {


            user.reasons.push(
                "Low completion compared to workload"
            );


        }


    });
    result.sort(
        (a, b) => b.activeTasks - a.activeTasks
    );
    return result;

}

export function generateRecommendations(

    context: AIAnalysisContext

): AIRecommendation[] {


    const recommendations:
        AIRecommendation[] = [];



    /*
        Health based recommendation
    */

    if (
        context.health &&
        context.health.score < 50
    ) {

        recommendations.push({

            type: "PROJECT",

            priority: "CRITICAL",

            message:
                "Project health is critical. Review risks and overdue work immediately."

        });

    }



    /*
        Risk based recommendation
    */

    const overdueRisk =
        context.risks?.some(task =>
            task.reasons.includes(
                "Task is overdue"
            )
        );


    if (overdueRisk) {


        recommendations.push({

            type: "TASK",

            priority: "HIGH",

            message:
                "Prioritize overdue tasks before starting new work."

        });

    }



    /*
        Workload based recommendation
    */

    const overloadedUsers =

        context.workload?.filter(user =>

            user.workloadStatus ===
            "OVERLOADED"

        );



    if (
        overloadedUsers &&
        overloadedUsers.length > 0
    ) {

        recommendations.push({

            type: "WORKLOAD",

            priority: "HIGH",

            message:
                "Redistribute tasks from overloaded team members."

        });

    }



    /*
        Completion recommendation
    */

    if (

        context.summary &&

        context.summary.completionRate < 50

    ) {

        recommendations.push({

            type: "PROJECT",

            priority: "MEDIUM",

            message:
                "Focus on completing existing tasks before adding new work."

        });

    }



    return recommendations;

}

export function analyzeTrend(
    history: {
        score: number | null;
        health: string | null;
        createdAt: Date;
    }[]
) {


    if (history.length < 2) {

        return {

            trend: "STABLE",

            previousScore: null,

            currentScore:
                history[0]?.score ?? null,

            difference: 0,

            message:
                "Not enough data to analyze trend."

        };

    }



    const current =
        history[0];


    const previous =
        history[1];



    const currentScore =
        current.score;


    const previousScore =
        previous.score;


    if (
        currentScore === null ||
        previousScore === null
    ) {

        return {

            trend: "UNKNOWN",
            previousScore,
            currentScore,
            difference: null,
            message:
                "AI history does not contain health scores."

        };

    }



    const difference =
        currentScore - previousScore;



    let trend:
        "IMPROVING" |
        "DECLINING" |
        "STABLE";



    if (difference > 5) {
        trend = "IMPROVING";
    }

    else if (difference < -5) {
        trend = "DECLINING";
    }

    else {
        trend = "STABLE";
    }



    let message;



    if (trend === "IMPROVING") {
        message =
            `Project health improved by ${difference} points.`;
    }

    else if (trend === "DECLINING") {

        message =
            `Project health dropped by ${Math.abs(difference)} points.`;

    }

    else {

        message =
            "Project health is stable.";

    }
    const comparison =
        compareHistory(

            {

                score: previousScore,

                health: previous.health

            },

            {

                score: currentScore,

                health: current.health

            }

        );



    return {

        trend,

        previousScore,

        currentScore,

        difference,

        message,

        healthChange:
            `${previous.health} → ${current.health}`,

        improvement:
            comparison

    };
}