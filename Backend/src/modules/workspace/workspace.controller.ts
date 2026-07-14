import { Request, Response } from "express";

import {
    createWorkspace
}
    from "./workspace.service";

import {
    createWorkspaceSchema
}
    from "./workspace.validations";
import {
    getOrganizationWorkspaces
}
    from "./workspace.service";
import {
    getWorkspaceById
}
    from "./workspace.service";
import {
    updateWorkspace
}
    from "./workspace.service";

import {
    updateWorkspaceSchema
}
    from "./workspace.validations";
import {
    deleteWorkspace
}
    from "./workspace.service";


// Custom Request type
// because protectRoute adds user information
interface AuthRequest extends Request {

    user?: {

        id: string;

        email: string;

    };

}


/*
    Create Workspace Controller

    Responsibilities:

    1. Receive HTTP request
    2. Validate body
    3. Get logged-in user
    4. Call service
    5. Send response

*/

export async function createWorkspaceController(

    req: AuthRequest,

    res: Response

) {

    try {


        /*
            Validate incoming data

            Example:

            {
                name:"Backend Team",
                organizationId:"uuid"
            }

        */

        const data =
            createWorkspaceSchema.parse(
                req.body
            );



        /*
            User comes from JWT middleware
        */

        const userId =
            req.user!.id;



        const workspace =
            await createWorkspace(

                userId,

                data.name,

                data.organizationId

            );



        res.status(201).json({

            success: true,

            message:
                "Workspace created successfully",

            workspace

        });


    }

    catch (error) {


        res.status(400).json({

            success: false,

            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong"

        });


    }

}

export async function getWorkspaces(

    req: AuthRequest,

    res: Response

) {

    try {


        const workspaces =
            await getOrganizationWorkspaces(

                req.params.organizationId,

                req.user!.id

            );


        res.json({

            success: true,

            workspaces

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

export async function getWorkspace(

    req: AuthRequest,

    res: Response

) {

    try {


        const workspace =
            await getWorkspaceById(

                req.params.workspaceId,

                req.user!.id

            );



        res.json({

            success: true,

            workspace

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

export async function updateWorkspaceController(

    req: AuthRequest,

    res: Response

) {

    try {


        const data =
            updateWorkspaceSchema.parse(
                req.body
            );



        const workspace =
            await updateWorkspace(

                req.params.workspaceId,

                req.user!.id,

                data.name!

            );



        res.json({

            success: true,

            message:
                "Workspace updated successfully",

            workspace

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

export async function deleteWorkspaceController(

    req: AuthRequest,

    res: Response

) {

    try {


        await deleteWorkspace(

            req.params.workspaceId,

            req.user!.id

        );


        res.json({

            success: true,

            message:
                "Workspace deleted successfully"

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