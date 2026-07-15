import {
    Request,
    Response
}
    from "express";


import {
    createTask,
    getProjectTasks,
    getTaskDetails
}
    from "./task.service";


import {
    createTaskSchema
}
    from "./task.validation";
import {
    updateTask
}
    from "./task.service";


import {
    updateTaskSchema
}
    from "./task.validation";
import {
    deleteTask
}
    from "./task.service";


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

                req.params.projectId,

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

                req.params.taskId,

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

                req.params.taskId,

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

            req.params.taskId,

            req.user!.id

        );



        res.json({

            success: true,

            message:
                "Task deleted successfully"

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