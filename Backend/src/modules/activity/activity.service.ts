import prisma from "../../config/prisma";


/*
    =======================================================
    Activity Service
    =======================================================

    Responsibilities:

    1. Create activity records

    Used by:
        Task
        Comment
        Project


    2. Fetch activity history

    Used by:
        Dashboard
        Timeline
*/


interface CreateActivityInput {


    action: string;


    description?: string;


    entityType?: string;


    entityId?: string;


    userId: string;


    workspaceId: string;

}



/*
    =======================================================
    CREATE ACTIVITY
    =======================================================

    Example:

    TASK_CREATED

    COMMENT_CREATED

    TASK_ASSIGNED

*/


export async function createActivity(

    data: CreateActivityInput

) {


    return prisma.activity.create({

        data: {

            action: data.action,

            description: data.description,

            entityType: data.entityType,

            entityId: data.entityId,

            userId: data.userId,

            workspaceId: data.workspaceId

        }

    });


}



/*
    =======================================================
    GET WORKSPACE ACTIVITIES
    =======================================================

    Fetch recent activities
    belonging to a workspace.

*/

export async function getWorkspaceActivities(

    workspaceId: string,

    userId: string

) {


    /*
        Check workspace membership.

        Security:

        User should only see
        activities of workspaces
        they belong to.

    */


    const membership =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId,

                    workspaceId

                }

            }

        });



    if (!membership) {

        throw new Error(

            "You don't have access to this workspace"

        );

    }



    /*
        Fetch activities.

        Include user details
        for frontend display.

    */


    const activities =

        await prisma.activity.findMany({

            where: {

                workspaceId

            },


            include: {

                user: {

                    select: {

                        id: true,

                        name: true,

                        avatar: true

                    }

                }

            },


            orderBy: {

                createdAt: "desc"

            },


            take: 50

        });



    return activities;

}