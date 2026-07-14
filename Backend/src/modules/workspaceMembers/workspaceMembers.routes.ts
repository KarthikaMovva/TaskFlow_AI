import {
    Router
}
    from "express";


import {
    protectRoute
}
    from "../../middleware/auth.middleware";


import {
    addMemberController
}
    from "./workspaceMembers.controller";
import { getWorkspaceMembersController } from "./workspaceMembers.controller";
import { updateMemberRoleController } from "./workspaceMembers.controller";
import { removeMemberController } from "./workspaceMembers.controller";



const router =
    Router();



/*
    Add member to workspace

    POST
    /api/workspaces/:workspaceId/members
*/

router.post(

    "/:workspaceId/members",

    protectRoute,

    addMemberController

);

router.get(

    "/:workspaceId/members",

    protectRoute,

    getWorkspaceMembersController

);

router.patch(

    "/:workspaceId/members/:memberId/role",

    protectRoute,

    updateMemberRoleController

);

router.delete(

    "/:workspaceId/members/:memberId",

    protectRoute,

    removeMemberController

);



export default router;