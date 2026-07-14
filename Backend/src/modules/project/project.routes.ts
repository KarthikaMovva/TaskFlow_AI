import {
    Router
}
    from "express";

import {
    protectRoute
}
    from "../../middleware/auth.middleware";

import {
    createProjectController,
    getWorkspaceProjectsController,
    getProjectController,
    updateProjectController,
    deleteProjectController
}
    from "./project.controller";

const router = Router();

/*
    Create Project

    POST /api/projects
*/

router.post(

    "/",

    protectRoute,

    createProjectController

);

router.get(

    "/workspace/:workspaceId",

    protectRoute,

    getWorkspaceProjectsController

);

router.get(

    "/:projectId",

    protectRoute,

    getProjectController

);
router.patch(

    "/:projectId",

    protectRoute,

    updateProjectController

);

router.delete(

    "/:projectId",

    protectRoute,

    deleteProjectController

);
export default router;