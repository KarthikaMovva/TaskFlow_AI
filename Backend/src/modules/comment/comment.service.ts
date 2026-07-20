import prisma from "../../config/prisma";
import { requireProjectAccess } from "../../utils/permission";
import { CreateCommentInput } from "./comment.validation";
import { UpdateCommentInput } from "./comment.validation";
import { createActivity }
    from "../activity/activity.service";

/*
    Create Comment
*/

export async function createComment(

    data: {
        message: string;
        taskId: string;
    },

    userId: string

) {

    /*
        Find task
    */


    const task = await prisma.task.findUnique({

        where: {

            id: data.taskId

        },

        include: {

            project: true

        }

    });
    console.log("Task:", task);

    if (!task) {

        throw new Error("Task not found");

    }

    /*
        Verify workspace access
    */

    await requireProjectAccess(

        task.projectId,

        userId

    );

    /*
        Create comment
    */

    const comment = await prisma.comment.create({

        data: {

            message: data.message,

            taskId: data.taskId,

            userId

        },

        include: {

            task: {

                include: {

                    project: true

                }

            }

        }

    });

    /*
        Create activity + notifications.
    
        Notify:
        - Task creator
        - Assigned user
    
        Do NOT notify the user
        who created the comment.
    */

    const receivers = [

        task.createdById,

        task.assignedToId

    ];

    /*
        Remove duplicate IDs.
    
        Example:
    
        Creator and assignee
        are the same user.
    */

    const uniqueReceivers = [...new Set(receivers)];
    console.log("Receivers:", uniqueReceivers);

    for (const receiverId of uniqueReceivers) {

        /*
            Skip invalid values
            and don't notify yourself.
        */

        if (

            !receiverId ||

            receiverId === userId

        ) {

            continue;

        }
        console.log("Sending notification to:", receiverId);
        await createActivity({

            action: "COMMENT_CREATED",

            description:

                `New comment on task "${task.title}"`,

            entityType: "COMMENT",

            entityId: comment.id,

            userId,

            workspaceId: task.project.workspaceId,

            notifyUserId: receiverId

        });

    }


    return comment;

}

/*
    Get all comments for a task
*/

export async function getTaskComments(

    taskId: string,

    userId: string

) {

    /*
        Verify task exists
    */

    const task = await prisma.task.findUnique({

        where: {
            id: taskId
        }

    });

    if (!task) {

        throw new Error("Task not found");

    }

    /*
        Verify user has access
    */

    await requireProjectAccess(

        task.projectId,

        userId

    );

    /*
        Fetch comments
    */

    const comments = await prisma.comment.findMany({

        where: {

            taskId

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

            createdAt: "asc"

        }

    });

    return comments;

}

/*
    Update Comment
*/

export async function updateComment(

    commentId: string,

    data: UpdateCommentInput,

    userId: string

) {

    /*
        Find comment
    */

    const comment = await prisma.comment.findUnique({

        where: {
            id: commentId
        },

        include: {

            task: {

                include: {

                    project: true

                }

            }

        }

    });

    if (!comment) {

        throw new Error("Comment not found");

    }

    /*
        Verify workspace access
    */

    await requireProjectAccess(

        comment.task.projectId,

        userId

    );

    /*
        Get workspace membership
    */

    const membership = await prisma.workspaceMember.findUnique({

        where: {

            userId_workspaceId: {

                userId,

                workspaceId: comment.task.project.workspaceId

            }

        }

    });

    /*
        Permission
    */

    const canUpdate =

        membership?.role === "OWNER" ||

        membership?.role === "ADMIN" ||

        comment.userId === userId;

    if (!canUpdate) {

        throw new Error(

            "You don't have permission to update this comment"

        );

    }

    /*
        Update
    */

    return prisma.comment.update({

        where: {

            id: commentId

        },

        data: {

            message: data.message

        },

        include: {

            user: {

                select: {

                    id: true,

                    name: true,

                    avatar: true

                }

            }

        }

    });

}

/*
    Delete Comment
*/

export async function deleteComment(

    commentId: string,

    userId: string

) {

    /*
        Find comment with task & project
    */

    const comment = await prisma.comment.findUnique({

        where: {
            id: commentId
        },

        include: {

            task: {

                include: {

                    project: true

                }

            }

        }

    });

    if (!comment) {

        throw new Error("Comment not found");

    }

    /*
        Verify user has access to project
    */

    await requireProjectAccess(

        comment.task.projectId,

        userId

    );

    /*
        Find workspace membership
    */

    const membership = await prisma.workspaceMember.findUnique({

        where: {

            userId_workspaceId: {

                userId,

                workspaceId:
                    comment.task.project.workspaceId

            }

        }

    });

    /*
        Permission check
    */

    const canDelete =

        membership?.role === "OWNER" ||

        membership?.role === "ADMIN" ||

        comment.userId === userId;

    if (!canDelete) {

        throw new Error(

            "You don't have permission to delete this comment"

        );

    }

    /*
        Delete comment
    */

    await prisma.comment.delete({

        where: {

            id: commentId

        }

    });

}