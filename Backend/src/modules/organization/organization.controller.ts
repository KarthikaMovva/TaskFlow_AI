import {
    Request,
    Response
}
    from "express";


import {
    createOrganization
}
    from "./organization.service";


import {
    createOrganizationSchema
}
    from "./organization.validation";


import {
    AuthRequest
}
    from "../../middleware/auth.middleware";
import {
    getUserOrganizations
} from "./organization.service";
import { getOrganizationById } from "./organization.service";
import {
    getOrganizationMembers
} from "./organization.service";
import {
    updateMemberRole
}
    from "./organization.service";

import {
    updateMemberRoleSchema
}
    from "./organization.validation";
import { removeMember } from "./organization.service";



export async function createOrg(

    req: AuthRequest,

    res: Response

) {

    try {


        const data =
            createOrganizationSchema.parse(
                req.body
            );



        const organization =
            await createOrganization(

                req.user!.id,

                data

            );



        res.status(201)
            .json({

                success: true,

                organization

            });


    }
    catch (error) {

        res.status(400)
            .json({

                success: false,

                message:
                    error instanceof Error
                        ?
                        error.message
                        :
                        "Failed"

            });

    }


}

/*
    Get all organizations
    for the authenticated user.
*/

export async function getOrganizations(

    req: AuthRequest,

    res: Response

) {

    try {

        const organizations =
            await getUserOrganizations(
                req.user!.id
            );



        res.json({

            success: true,

            organizations

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: "Failed to fetch organizations"

        });

    }

}

/*
    Get details of one organization.
*/

export async function getOrganization(

    req: AuthRequest,

    res: Response

) {

    try {

        const organization =
            await getOrganizationById(

                req.params.organizationId,

                req.user!.id

            );

        res.json({

            success: true,

            organization

        });

    }

    catch (error) {

        if (
            error instanceof Error &&
            error.message === "Access denied"
        ) {

            return res.status(403).json({

                success: false,

                message: error.message

            });

        }

        if (
            error instanceof Error &&
            error.message === "Organization not found"
        ) {

            return res.status(404).json({

                success: false,

                message: error.message

            });

        }

        return res.status(500).json({

            success: false,

            message: "Internal server error"

        });

    }

}

/*
    Get all members
    of an organization.
*/

export async function getMembers(

    req: AuthRequest,

    res: Response

) {

    try {

        const members =
            await getOrganizationMembers(

                req.params.organizationId,

                req.user!.id

            );

        res.json({

            success: true,

            members

        });

    }

    catch (error) {

        if (
            error instanceof Error &&
            error.message === "Access denied"
        ) {

            return res.status(403).json({

                success: false,

                message: error.message

            });

        }

        return res.status(500).json({

            success: false,

            message: "Failed to fetch members"

        });

    }

}

export async function changeMemberRole(

    req: AuthRequest,

    res: Response

) {

    try {

        const data =
            updateMemberRoleSchema.parse(
                req.body
            );



        const member =
            await updateMemberRole(

                req.params.organizationId,

                req.user!.id,

                req.params.memberId,

                data.role

            );



        res.json({

            success: true,

            member

        });

    }

    catch (error) {

        return res.status(400).json({

            success: false,

            message:
                error instanceof Error
                    ? error.message
                    : "Failed"

        });

    }

}

export async function deleteMember(
    req: AuthRequest,
    res: Response
) {

    try {

        await removeMember(
            req.params.organizationId,
            req.user!.id,
            req.params.memberId
        );

        res.json({

            success: true,
            message: "Member removed successfully"

        });

    }
    catch (error) {

        return res.status(400).json({

            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed"

        });

    }

}