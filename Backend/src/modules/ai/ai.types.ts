import {
    Project,
    Task,
    User,
    Comment
} from "@prisma/client";


export interface TaskWithRelations extends Task {
    assignedTo: User | null;
    comments: Comment[];
}



export interface ProjectSummary {
    totalTasks: number;
    completed: number;
    inProgress: number;
    todo: number;
    review: number;
    completionRate: number;
}



export interface AIAnalysisContext {
    project: Project;
    tasks: TaskWithRelations[];
    summary?: ProjectSummary;
    health?: HealthAnalysis;
    risks?: TaskRisk[];
    workload?: UserWorkload[];
    recommendations?: AIRecommendation[];
    narrative?: String;
    generatedAt: Date;
}

export interface HealthAnalysis {
    health:
    | "EXCELLENT"
    | "GOOD"
    | "WARNING"
    | "CRITICAL";
    score: number;
    reasons: string[];
}

export interface TaskRisk {
    taskId: string;
    title: string;
    riskScore: number;
    riskLevel:
    | "CRITICAL"
    | "HIGH"
    | "MEDIUM"
    | "LOW";
    reasons: string[];
}

export interface UserWorkload {
    userId: string;
    userName: string;
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    workloadStatus:
    | "LIGHT"
    | "NORMAL"
    | "OVERLOADED";
    reasons: string[];

}

export interface AIRecommendation {
    type:
    | "PROJECT"
    | "TASK"
    | "WORKLOAD";
    priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";
    message: string;
}

export type TrendDirection =
    | "IMPROVING"
    | "DECLINING"
    | "STABLE";

export interface AIReport {
    project: {
        id: string;
        name: string;
        status: string;
    };
    overview: {
        summary: any;
        health: any;
    };
    risks: any[];
    workload: any[];
    recommendations: any[];
    narrative: string;
    aiSummary?: string;
    generatedAt: Date;
}