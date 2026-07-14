import {
    Router
}
    from "express";


import {
    createWorkspaceController
}
    from "./workspace.controller";


import {
    protectRoute
}
    from "../../middleware/auth.middleware";
import { getWorkspaces } from "./workspace.controller";
import { getWorkspace } from "./workspace.controller";
import { updateWorkspaceController } from "./workspace.controller";
import { deleteWorkspaceController } from "./workspace.controller";



const router =
    Router();



/*
    Create Workspace

    Protected route because
    only authenticated users
    can create workspaces.
*/

router.post(

    "/",

    protectRoute,

    createWorkspaceController

);

router.get(

    "/organization/:organizationId",

    protectRoute,

    getWorkspaces

);

router.get(

    "/:workspaceId",

    protectRoute,

    getWorkspace

);

router.patch(

    "/:workspaceId",

    protectRoute,

    updateWorkspaceController

);

router.delete(

    "/:workspaceId",

    protectRoute,

    deleteWorkspaceController

);



export default router;