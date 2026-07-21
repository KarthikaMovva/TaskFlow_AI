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


router.get(

    "/workspace/:workspaceId",

    protectRoute,

    getActivityController

);



export default router;