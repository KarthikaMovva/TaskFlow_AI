import prisma from "../../config/prisma";
import {
    createNotification
} from "../notification/notification.service";
import {
    requireWorkspaceMember
} from "../../utils/permission";

interface CreateActivityInput {

    action: string;
    description?: string;
    entityType?: string;
    entityId?: string;
    userId: string;
    workspaceId: string;
    notifyUserId?: string;
    notifyTaskId?: string;


}

export async function createActivity(
    data: CreateActivityInput
) {

    const activity =
        await prisma.activity.create({
            data: {
                action: data.action,
                description: data.description,
                entityType: data.entityType,
                entityId: data.entityId,
                userId: data.userId,
                workspaceId: data.workspaceId
            }

        });


    if (data.notifyUserId) {
        await createNotification({
            title: data.action,
            message:
                data.description ??
                "New activity",
            userId: data.notifyUserId,
            taskId: data.notifyTaskId
        });
    }




    return activity;


}

export async function getWorkspaceActivities(
    workspaceId: string,
    userId: string
) {
    await requireWorkspaceMember(workspaceId, userId);

    return prisma.activity.findMany({
        where: {
            workspaceId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}
