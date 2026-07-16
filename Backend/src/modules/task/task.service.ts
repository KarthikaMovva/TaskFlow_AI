import prisma from "../../config/prisma";

import {

    Priority,
    TaskStatus

}
    from "@prisma/client";

import {

    requireProjectAccess

}
    from "../../utils/permission";
import {
    UpdateTaskInput,
    AssignTaskInput,
    ReorderTasksInput
}
    from "./task.validation";

/*
    Create Task

    Any workspace member
    with project access
    can create tasks.
*/

export async function createTask(

    data: {

        title: string;

        description?: string;

        projectId: string;

        priority?: Priority;

        dueDate?: string;

    },

    userId: string

) {


    /*
        Check whether user
        can access project.
    */

    const project =

        await requireProjectAccess(

            data.projectId,

            userId

        );



    /*
        Create task
    */

    const task =

        await prisma.task.create({

            data: {


                title: data.title,


                description: data.description,


                projectId: project.id,


                priority:

                    data.priority ??

                    Priority.MEDIUM,


                status:

                    TaskStatus.TODO,


                position: 0,


                createdById: userId,


                dueDate:

                    data.dueDate

                        ? new Date(data.dueDate)

                        : undefined


            }

        });



    return task;

}

/*
    Get all tasks belonging to a project.

    Any workspace member with
    project access can view tasks.
*/

export async function getProjectTasks(

    projectId: string,

    userId: string

) {


    /*
        Verify user has access
        to this project.
    */

    await requireProjectAccess(

        projectId,

        userId

    );



    /*
        Fetch tasks.

        Include:
        - assigned user
        - creator

        This will help frontend
        display names and avatars.
    */

    const tasks =

        await prisma.task.findMany({

            where: {

                projectId

            },


            include: {


                assignedTo: {

                    select: {

                        id: true,

                        name: true,

                        email: true,

                        avatar: true

                    }

                },


                createdBy: {

                    select: {

                        id: true,

                        name: true

                    }

                }


            },


            orderBy: [

                {

                    position: "asc"

                },

                {

                    createdAt: "asc"

                }

            ]

        });



    return tasks;

}

/*
    Get single task details.

    Any workspace member
    having access to the project
    can view the task.
*/

export async function getTaskDetails(

    taskId: string,

    userId: string

) {


    /*
        Find task with project
        information.
    */

    const task =

        await prisma.task.findUnique({

            where: {

                id: taskId

            },


            include: {


                project: true,


                assignedTo: {

                    select: {

                        id: true,

                        name: true,

                        email: true,

                        avatar: true

                    }

                },


                createdBy: {

                    select: {

                        id: true,

                        name: true,

                        email: true

                    }

                }

            }

        });



    if (!task) {

        throw new Error(
            "Task not found"
        );

    }



    /*
        Verify user can access
        the project.
    */

    await requireProjectAccess(

        task.projectId,

        userId

    );



    return task;

}

/*
    Update Task

    Allowed:

    - OWNER
    - ADMIN
    - Task creator
    - Assigned user
*/

export async function updateTask(

    taskId: string,

    data: UpdateTaskInput,

    userId: string

) {


    const task =

        await prisma.task.findUnique({

            where: {
                id: taskId
            }

        });



    if (!task) {

        throw new Error(
            "Task not found"
        );

    }



    /*
        Verify workspace access
    */

    const project =

        await requireProjectAccess(

            task.projectId,

            userId

        );



    /*
        Check ownership rules
    */

    const membership =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId,

                    workspaceId:
                        project.workspaceId

                }

            }

        });



    const canUpdate =

        membership?.role === "OWNER" ||

        membership?.role === "ADMIN" ||

        task.createdById === userId ||

        task.assignedToId === userId;



    if (!canUpdate) {

        throw new Error(
            "You don't have permission to update this task"
        );

    }



    const updatedTask =

        await prisma.task.update({

            where: {
                id: taskId
            },


            data: {


                ...data,


                dueDate:

                    data.dueDate

                        ? new Date(data.dueDate)

                        : undefined

            }

        });



    return updatedTask;

}

/*
    Delete Task

    Allowed:

    - Workspace OWNER
    - Workspace ADMIN
    - Task Creator
*/

export async function deleteTask(

    taskId: string,

    userId: string

) {


    /*
        Find task
    */

    const task =

        await prisma.task.findUnique({

            where: {
                id: taskId
            }

        });



    if (!task) {

        throw new Error(
            "Task not found"
        );

    }



    /*
        Verify project access
    */

    const project =

        await requireProjectAccess(

            task.projectId,

            userId

        );



    /*
        Find user's workspace role
    */

    const membership =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId,

                    workspaceId:
                        project.workspaceId

                }

            }

        });



    const canDelete =

        membership?.role === "OWNER" ||

        membership?.role === "ADMIN" ||

        task.createdById === userId;



    if (!canDelete) {

        throw new Error(

            "You don't have permission to delete this task"

        );

    }



    await prisma.task.delete({

        where: {
            id: taskId
        }

    });


}


/*
    Assign Task

    Allows OWNER, ADMIN, or task creator
    to assign a task to a workspace member.
*/

export async function assignTask(

    taskId: string,

    data: AssignTaskInput,

    userId: string

) {


    const task =

        await prisma.task.findUnique({

            where: {
                id: taskId
            }

        });



    if (!task) {

        throw new Error(
            "Task not found"
        );

    }



    /*
        Verify project access
    */

    const project =

        await requireProjectAccess(

            task.projectId,

            userId

        );



    /*
        Check user has permission
        to assign tasks (OWNER/ADMIN or creator)
    */

    const membership =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId,

                    workspaceId:
                        project.workspaceId

                }

            }

        });



    const canAssign =

        membership?.role === "OWNER" ||

        membership?.role === "ADMIN" ||

        task.createdById === userId;



    if (!canAssign) {

        throw new Error(
            "You don't have permission to assign this task"
        );

    }



    /*
        Verify the assignee is a workspace member
    */

    const assigneeMembership =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId: data.assignedToId,

                    workspaceId:
                        project.workspaceId

                }

            }

        });



    if (!assigneeMembership) {

        throw new Error(
            "Assignee is not a member of this workspace"
        );

    }



    const updatedTask =

        await prisma.task.update({

            where: {
                id: taskId
            },

            data: {

                assignedToId: data.assignedToId

            }

        });



    return updatedTask;

}

/*
    =======================================================
    Reorder Tasks
    =======================================================

    This service updates the position of every task
    inside a project.

    The frontend sends the ordered list of task IDs.

    Example:

    taskIds =

    [
        Task-C,
        Task-A,
        Task-B
    ]

    Backend converts this into

    Task-C -> position = 1

    Task-A -> position = 2

    Task-B -> position = 3

    Why transaction?

    Suppose updating five tasks.

    If task 4 fails,

    task 1,2,3 should NOT remain updated.

    A transaction guarantees

    ALL succeed

    OR

    ALL fail.
*/

export async function reorderTasks(

    projectId: string,

    data: ReorderTasksInput,

    userId: string

) {

    /*
        Verify the logged-in user
        has access to the project.
    */

    const project =

        await requireProjectAccess(

            projectId,

            userId

        );



    /*
        Verify every task belongs
        to the given project.

        Prevents users from sending
        task IDs belonging to another project.
    */

    const tasks =

        await prisma.task.findMany({

            where: {

                id: {

                    in: data.taskIds

                }

            }

        });



    /*
        Safety check.
    */

    if (

        tasks.some(

            task =>

                task.projectId !== project.id

        )

    ) {

        throw new Error(

            "One or more tasks do not belong to this project."

        );

    }



    /*
        Update every task position.

        Prisma transaction ensures
        database consistency.
    */

    await prisma.$transaction(

        data.taskIds.map(

            (

                taskId,

                index

            ) =>

                prisma.task.update({

                    where: {

                        id: taskId

                    },

                    data: {

                        /*
                            Position starts from 1.

                            Easier to read
                            than starting from 0.
                        */

                        position:

                            index + 1

                    }

                })

        )

    );



    return {

        success: true

    };

}
