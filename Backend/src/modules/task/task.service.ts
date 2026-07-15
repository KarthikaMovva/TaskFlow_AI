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
    UpdateTaskInput
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