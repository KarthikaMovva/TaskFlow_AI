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
    deleteTaskController

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


export default router;