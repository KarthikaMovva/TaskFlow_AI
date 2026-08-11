export type Role = "OWNER" | "ADMIN" | "MEMBER";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface Organization {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
    owner?: User;
    members?: OrganizationMember[];
    workspaces?: Workspace[];
}

export interface OrganizationMember {
    id: string;
    organizationId: string;
    userId: string;
    role: Role;
    joinedAt: string;
    user?: User;
    organization?: Organization;
}

export interface Workspace {
    id: string;
    name: string;
    organizationId: string;
    createdAt: string;
    organization?: Organization;
    members?: WorkspaceMember[];
    projects?: Project[];
}

export interface WorkspaceMember {
    id: string;
    userId: string;
    workspaceId: string;
    role: Role;
    joinedAt: string;
    user?: User;
    workspace?: Workspace;
}

export interface Project {
    id: string;
    name: string;
    description?: string | null;
    status: ProjectStatus;
    workspaceId: string;
    createdAt: string;
    workspace?: {
        id: string;
        name: string;
    };
    tasks?: Task[];
}

export interface Task {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    position: number;
    priority: Priority;
    projectId: string;
    assignedToId?: string | null;
    createdById: string;
    dueDate?: string | null;
    createdAt: string;
    assignedTo?: User | null;
    createdBy?: User;
    project?: Project;
    comments?: Comment[];
}

export interface Comment {
    id: string;
    message: string;
    taskId: string;
    userId: string;
    createdAt: string;
    user?: User;
}

export interface Activity {
    id: string;
    action: string;
    description?: string | null;
    entityId?: string | null;
    entityType?: string | null;
    userId: string;
    workspaceId: string;
    createdAt: string;
    user?: User;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    userId: string;
    taskId?: string | null;
    createdAt: string;
}

export interface KanbanBoardData {
    TODO: Task[];
    IN_PROGRESS: Task[];
    IN_REVIEW: Task[];
    DONE: Task[];
}

export interface AIAnalysis {
    healthScore: number;
    status: "HEALTHY" | "WARNING" | "CRITICAL";
    completionRate: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    highRiskTasks: Array<{
        task: Task;
        reason: string;
        riskLevel: "HIGH" | "CRITICAL";
    }>;
    workloadDistribution: Array<{
        user: User;
        taskCount: number;
    }>;
    recommendations: string[];
    summaryNarrative: string;
}
