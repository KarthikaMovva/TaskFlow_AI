import {
    Router
}
    from "express";


import {
    createOrg
}
    from "./organization.controller";


import {
    protectRoute
}
    from "../../middleware/auth.middleware";
import { getOrganizations } from "./organization.controller";
import { getOrganization } from "./organization.controller";
import { getMembers } from "./organization.controller";
import { changeMemberRole } from "./organization.controller";
import { deleteMember } from "./organization.controller";



const router =
    Router();



router.post(

    "/",

    protectRoute,

    createOrg

);

router.get(

    "/",

    protectRoute,

    getOrganizations

);

router.patch(
    "/:organizationId/members/:memberId/role",
    protectRoute,
    changeMemberRole
);

router.get(
    "/:organizationId",
    protectRoute,
    getOrganization
);

router.get(
    "/:organizationId/members",
    protectRoute,
    getMembers
);

router.delete(
    "/:organizationId/members/:memberId",
    protectRoute,
    deleteMember
);


export default router;