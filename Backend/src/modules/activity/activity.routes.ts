import {
    Router
}
    from "express";


import {

    protectRoute

}
    from "../../middleware/auth.middleware";


import {

    getActivityController

}
    from "./activity.controller";



const router = Router();



/*
    =======================================================
    Workspace Activity Feed

    GET

    /api/activity/workspace/:workspaceId

    Example:

    /api/activity/workspace/abc-123

*/


router.get(

    "/workspace/:workspaceId",

    protectRoute,

    getActivityController

);



export default router;