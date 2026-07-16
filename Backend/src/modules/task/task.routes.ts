import {
    Router
}
    from "express";


import {

    protectRoute

}
    from "../../middleware/auth.middleware";


import {

    createTaskController,
    getProjectTasksController,
    getTaskDetailsController,
    updateTaskController,
    deleteTaskController,
    assignTaskController,
    reorderTasksController

}
    from "./task.controller";



const router = Router();



/*
    Create Task

    POST /api/tasks
*/

router.post(

    "/",

    protectRoute,

    createTaskController

);

/*
    Get all tasks of project

    GET /api/tasks/project/:projectId
*/

router.get(

    "/project/:projectId",

    protectRoute,

    getProjectTasksController

);

/*
    Get single task

    GET /api/tasks/:taskId
*/

router.get(

    "/:taskId",

    protectRoute,

    getTaskDetailsController

);

router.patch(

    "/:taskId",

    protectRoute,

    updateTaskController

);

/*
    Delete Task

    DELETE /api/tasks/:taskId
*/

router.delete(

    "/:taskId",

    protectRoute,

    deleteTaskController

);

/*
    Assign Task

    PATCH /api/tasks/:taskId/assign
*/

router.patch(

    "/:taskId/assign",

    protectRoute,

    assignTaskController

);

/*
    =======================================================
    Reorder Tasks

    PATCH /api/tasks/project/:projectId/reorder

    Used by Kanban drag-and-drop.

    Updates the position of every task
    inside the project.
*/

router.patch(

    "/project/:projectId/reorder",

    protectRoute,

    reorderTasksController

);


export default router;