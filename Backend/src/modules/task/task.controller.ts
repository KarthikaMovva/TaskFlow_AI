import {
    Request,
    Response
}
    from "express";
import {
    Prisma
}
    from "@prisma/client";


import {
    createTask,
    getProjectTasks,
    getWorkspaceTasks,
    getTaskDetails,
    updateTask,
    deleteTask,
    assignTask,
    reorderTasks
}
    from "./task.service";


import {
    createTaskSchema,
    updateTaskSchema,
    assignTaskSchema,
    reorderTasksSchema
}
    from "./task.validation";


/*
    Custom request type.

    Our auth middleware attaches
    logged-in user information
    to req.user.
*/

interface AuthRequest extends Request {

    user?: {

        id: string;

        email: string;

    };

}



/*
    Create Task Controller

    Responsibilities:

    1. Validate request body
    2. Get logged-in user
    3. Call service
    4. Return response
*/

export async function createTaskController(

    req: AuthRequest,

    res: Response

) {


    try {


        /*
            Validate incoming data.

            Example:

            {
                title:"Create Login API",
                projectId:"uuid"
            }

        */

        const data =

            createTaskSchema.parse(

                req.body

            );



        /*
            Create task
        */

        const task =

            await createTask(

                data,

                req.user!.id

            );



        res.status(201).json({

            success: true,

            message:
                "Task created successfully",

            task

        });


    }

    catch (error) {


        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed to create task"

        });


    }


}

/*
    Get tasks of a project
*/

export async function getProjectTasksController(

    req: AuthRequest,

    res: Response

) {

    try {


        const tasks =

            await getProjectTasks(

                req.params.projectId as string,

                req.user!.id

            );



        res.json({

            success: true,

            tasks

        });


    }

    catch (error) {


        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed to fetch tasks"

        });


    }

}

/*
    Get Task Details Controller
*/

export async function getTaskDetailsController(

    req: AuthRequest,

    res: Response

) {

    try {


        const task =

            await getTaskDetails(

                req.params.taskId as string,

                req.user!.id

            );



        res.json({

            success: true,

            task

        });


    }

    catch (error) {


        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed to fetch task"

        });


    }

}

export async function updateTaskController(

    req: AuthRequest,

    res: Response

) {

    try {


        const data =

            updateTaskSchema.parse(

                req.body

            );



        const task =

            await updateTask(

                req.params.taskId as string,

                data,

                req.user!.id

            );



        res.json({

            success: true,

            message:
                "Task updated successfully",

            task

        });


    }

    catch (error) {

        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed"

        });

    }

}

/*
    Delete Task Controller
*/

export async function deleteTaskController(

    req: AuthRequest,

    res: Response

) {

    try {


        await deleteTask(

            req.params.taskId as string,

            req.user!.id

        );



        res.json({

            success: true,

            message:
                "Task deleted successfully"

        });


    }

    catch (error) {

        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete task";

        const status =
            message === "Task not found" || message === "Project not found"
                ? 404
                : message === "You are not a member of this workspace" ||
                    message === "You don't have permission to delete this task"
                    ? 403
                    : error instanceof Prisma.PrismaClientKnownRequestError &&
                        error.code === "P2003"
                        ? 409
                        : 500;

        res.status(status).json({

            success: false,

            message

        });

    }

}

/*
    Assign Task Controller
*/

export async function assignTaskController(

    req: AuthRequest,

    res: Response

) {

    try {


        const data =

            assignTaskSchema.parse(

                req.body

            );



        const task =

            await assignTask(

                req.params.taskId as string,

                data,

                req.user!.id

            );



        res.json({

            success: true,

            message:
                "Task assigned successfully",

            task

        });


    }

    catch (error) {

        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed"

        });

    }

}

/*
    =======================================================
    Reorder Tasks Controller
    =======================================================

    Responsibilities

    1. Validate request body.
    2. Read projectId.
    3. Call service.
    4. Return response.

    This endpoint is used by the
    Kanban drag-and-drop frontend.

    The frontend sends

    {
        taskIds:[
            "...",
            "...",
            "..."
        ]
    }

    The order inside taskIds
    becomes the order of tasks
    inside the database.
*/

export async function reorderTasksController(

    req: AuthRequest,

    res: Response

) {

    try {

        /*
            Validate request body.
        */

        const data =

            reorderTasksSchema.parse(

                req.body

            );



        /*
            Call service.
        */

        await reorderTasks(

            req.params.projectId,

            data,

            req.user!.id

        );



        return res.status(200).json({

            success: true,

            message:

                "Tasks reordered successfully"

        });

    }

    catch (error) {

        return res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed to reorder tasks"

        });

    }

}

export async function getWorkspaceTasksController(

    req: AuthRequest,

    res: Response

) {

    try {

        const tasks =

            await getWorkspaceTasks(

                req.params.workspaceId as string,

                req.user!.id

            );

        res.json({

            success: true,

            tasks

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed to fetch workspace tasks"

        });

    }

}
