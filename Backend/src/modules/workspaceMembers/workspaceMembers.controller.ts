import { Request, Response } from "express";

import {
    addMember
}
    from "./workspaceMembers.service";

import {
    addWorkspaceMemberSchema
}
    from "./workspaceMembers.validation";

import {
    Role
}
    from "@prisma/client";
import {
    getWorkspaceMembers
}
    from "./workspaceMembers.service";
import {
    updateMemberRole
}
    from "./workspaceMembers.service";
import {
    updateWorkspaceMemberRoleSchema
}
    from "./workspaceMembers.validation";
import {
    removeMember
}
    from "./workspaceMembers.service";



/*
    Custom Request type.

    protectRoute middleware adds
    user information from JWT.
*/

interface AuthRequest extends Request {

    user?: {

        id: string;

        email: string;

    };

}



/*
    Add Member Controller

    Responsibilities:

    1. Validate request body
    2. Get logged-in user
    3. Call service
    4. Return response
*/

export async function addMemberController(

    req: AuthRequest,

    res: Response

) {

    try {


        /*
            Validate body

            Example:

            {
                userId:"uuid",
                role:"MEMBER"
            }

        */

        const data =
            addWorkspaceMemberSchema.parse(
                req.body
            );



        const member =
            await addMember(

                req.params.workspaceId as string,

                req.user!.id,

                data.userId,

                data.role ?? Role.MEMBER

            );



        res.status(201).json({

            success: true,

            message:
                "Member added successfully",

            member

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

export async function getWorkspaceMembersController(

    req: AuthRequest,

    res: Response

) {

    try {


        const members =

            await getWorkspaceMembers(

                req.params.workspaceId as string,

                req.user!.id

            );



        res.json({

            success: true,

            members

        });


    }

    catch (error) {


        res.status(403).json({

            success: false,

            message:
                error instanceof Error
                    ? error.message
                    : "Failed"

        });


    }

}

export async function updateMemberRoleController(

    req: AuthRequest,

    res: Response

) {

    try {


        const data =

            updateWorkspaceMemberRoleSchema.parse(
                req.body
            );



        const member =

            await updateMemberRole(

                req.params.workspaceId as string,

                req.user!.id,

                req.params.memberId as string,

                data.role

            );



        res.json({

            success: true,

            message:
                "Member role updated successfully",

            member

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

export async function removeMemberController(

    req: AuthRequest,

    res: Response

) {

    try {


        await removeMember(

            req.params.workspaceId as string,

            req.user!.id,

            req.params.memberId as string

        );



        res.json({

            success: true,

            message:
                "Member removed successfully"

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