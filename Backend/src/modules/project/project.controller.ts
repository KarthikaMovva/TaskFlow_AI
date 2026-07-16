import { Request, Response } from "express";

import {
    createProject
} from "./project.service";

import {
    createProjectSchema
} from "./project.validation";

import {
    ProjectStatus
} from "@prisma/client";
import {
    getWorkspaceProjects,
    getProjectById,
    updateProject,
    deleteProject
}
    from "./project.service";

import {

    updateProjectSchema

}

    from "./project.validation";


/*
    Request after authentication.

    protectRoute middleware
    attaches the logged-in user.
*/
interface AuthRequest extends Request {

    user?: {

        id: string;

        email: string;

    };

}


/*
    Create Project Controller

    Responsibilities:

    1. Validate request
    2. Get authenticated user
    3. Call service
    4. Return response
*/
export async function createProjectController(

    req: AuthRequest,

    res: Response

) {

    try {

        /*
            Validate request body
        */

        const data =
            createProjectSchema.parse(
                req.body
            );



        /*
            Create project
        */

        const project =
            await createProject(

                data.name,

                data.description,

                data.workspaceId,

                data.status ?? ProjectStatus.PLANNING,

                req.user!.id

            );



        res.status(201).json({

            success: true,

            message:
                "Project created successfully",

            project

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

/*
    Get all projects
    inside a workspace.
*/

export async function getWorkspaceProjectsController(

    req: AuthRequest,

    res: Response

) {

    try {


        const projects =

            await getWorkspaceProjects(

                req.params.workspaceId as string,

                req.user!.id

            );



        res.json({

            success: true,

            projects

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

/*
    Get Project Details
*/
export async function getProjectController(

    req: AuthRequest,

    res: Response

) {

    try {

        const project =
            await getProjectById(

                req.params.projectId as string,

                req.user!.id

            );

        res.json({

            success: true,

            project

        });

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message:

                error instanceof Error
                    ? error.message
                    : "Failed"

        });

    }

}

/*
    Update Project
*/

export async function updateProjectController(

    req: AuthRequest,

    res: Response

) {

    try {

        const data =

            updateProjectSchema.parse(

                req.body

            );



        const project =

            await updateProject(

                req.params.projectId as string,

                req.user!.id,

                data

            );



        res.json({

            success: true,

            message:

                "Project updated successfully",

            project

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

/*
    Delete Project
*/
export async function deleteProjectController(

    req: AuthRequest,

    res: Response

) {

    try {

        await deleteProject(

            req.params.projectId as string,

            req.user!.id

        );

        res.json({

            success: true,

            message: "Project deleted successfully"

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