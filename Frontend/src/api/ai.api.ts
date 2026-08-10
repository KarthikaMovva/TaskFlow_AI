import { AIAnalysis, Project, Task } from "@/src/types";

export const aiApi = {
    analyzeProject: (project: Project, tasks: Task[]): AIAnalysis => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === "DONE").length;
        const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
        const todoTasks = tasks.filter((t) => t.status === "TODO" || t.status === "IN_REVIEW").length;

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const now = new Date();
        const highRiskTasks: Array<{ task: Task; reason: string; riskLevel: "HIGH" | "CRITICAL" }> = [];

        tasks.forEach((task) => {
            if (task.status !== "DONE") {
                if (task.dueDate && new Date(task.dueDate) < now) {
                    highRiskTasks.push({
                        task,
                        reason: `Overdue since ${new Date(task.dueDate).toLocaleDateString()}`,
                        riskLevel: "CRITICAL",
                    });
                } else if (task.priority === "URGENT") {
                    highRiskTasks.push({
                        task,
                        reason: "Marked as URGENT priority",
                        riskLevel: "HIGH",
                    });
                } else if (!task.assignedToId && (task.priority === "HIGH" || task.status === "IN_PROGRESS")) {
                    highRiskTasks.push({
                        task,
                        reason: "High priority task is currently unassigned",
                        riskLevel: "HIGH",
                    });
                }
            }
        });

        // Calculate Health Score
        let score = 100;
        if (totalTasks === 0) {
            score = 80;
        } else {
            // Deduct points for high-risk tasks and low completion
            const criticalCount = highRiskTasks.filter((r) => r.riskLevel === "CRITICAL").length;
            const highCount = highRiskTasks.filter((r) => r.riskLevel === "HIGH").length;

            score -= criticalCount * 15;
            score -= highCount * 8;

            if (completionRate < 30 && totalTasks >= 5) {
                score -= 15;
            }
        }
        score = Math.max(10, Math.min(100, score));

        let status: "HEALTHY" | "WARNING" | "CRITICAL" = "HEALTHY";
        if (score < 50) status = "CRITICAL";
        else if (score < 75) status = "WARNING";

        // Workload distribution
        const userMap = new Map<string, { user: any; count: number }>();
        tasks.forEach((t) => {
            if (t.assignedTo) {
                const existing = userMap.get(t.assignedTo.id);
                if (existing) {
                    existing.count += 1;
                } else {
                    userMap.set(t.assignedTo.id, { user: t.assignedTo, count: 1 });
                }
            }
        });

        const workloadDistribution = Array.from(userMap.values()).map((item) => ({
            user: item.user,
            taskCount: item.count,
        }));

        // Generate actionable recommendations
        const recommendations: string[] = [];
        if (highRiskTasks.length > 0) {
            recommendations.push(`Address ${highRiskTasks.length} high-risk task(s) immediately to prevent release delays.`);
        }
        if (tasks.some((t) => !t.assignedToId && t.status !== "DONE")) {
            recommendations.push("Assign unassigned pending tasks to active team members.");
        }
        if (completionRate < 40 && totalTasks > 3) {
            recommendations.push("Focus team bandwidth on moving IN_PROGRESS tasks to DONE.");
        }
        if (recommendations.length === 0) {
            recommendations.push("Project pace is optimal. Maintain current velocity.");
            recommendations.push("Conduct periodic backlog triage for new items.");
        }

        // Summary narrative
        const summaryNarrative =
            totalTasks === 0
                ? `Project "${project.name}" is currently in ${project.status} stage with no tasks logged yet. Create tasks to begin tracking.`
                : `Project "${project.name}" has an AI Health Score of ${score}/100 (${status}). Total progress stands at ${completionRate}% with ${completedTasks} completed, ${inProgressTasks} active, and ${highRiskTasks.length} risk flags detected.`;

        return {
            healthScore: score,
            status,
            completionRate,
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks,
            highRiskTasks,
            workloadDistribution,
            recommendations,
            summaryNarrative,
        };
    },
};
