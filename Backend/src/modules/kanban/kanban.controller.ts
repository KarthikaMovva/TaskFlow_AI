import {
    Request,
    Response
} from "express";

import prisma from "../../config/prisma";

import {
    requireProjectAccess
} from "../../utils/permission";


interface AuthRequest extends Request {

    user?: {
        id: string;
    };

}


/**
 * Safely extract a route parameter as a string.
 */
const getParam = (
    value: string | string[] | undefined
): string | undefined => {

    if (Array.isArray(value)) {

        return value[0];

    }

    return value;

};


/**
 * Get Kanban board of a project.
 *
 * Returns tasks grouped by status:
 *
 * {
 *   TODO: [],
 *   IN_PROGRESS: [],
 *   IN_REVIEW: [],
 *   DONE: []
 * }
 */
export const getBoard = async (

    req: AuthRequest,

    res: Response

) => {

    try {

        /**
         * Normalize Express route parameter.
         */
        const projectId =
            getParam(
                req.params.projectId
            );


        /**
         * Validate projectId.
         */
        if (!projectId) {

            return res.status(400).json({

                success: false,

                message:
                    "Project ID is required"

            });

        }


        /**
         * Authentication middleware should
         * provide req.user.
         */
        if (!req.user) {

            return res.status(401).json({

                success: false,

                message:
                    "Unauthorized"

            });

        }


        /**
         * Verify that the authenticated user
         * has access to this project.
         */
        await requireProjectAccess(

            projectId,

            req.user.id

        );


        /**
         * Fetch project tasks.
         */
        const tasks =
            await prisma.task.findMany({

                where: {

                    projectId

                },

                orderBy: {

                    position:
                        "asc"

                },

                include: {

                    assignedTo: {

                        select: {

                            id: true,

                            name: true,

                            email: true

                        }

                    },

                    createdBy: {

                        select: {

                            id: true,

                            name: true

                        }

                    }

                }

            });


        /**
         * Explicitly type the board so that
         * the arrays are not inferred as never[].
         */
        const board: Record<
            string,
            typeof tasks
        > = {

            TODO: [],

            IN_PROGRESS: [],

            IN_REVIEW: [],

            DONE: []

        };


        /**
         * Group tasks by status.
         *
         * The status values come from the database
         * and correspond to the Kanban columns.
         */
        tasks.forEach(
            (task) => {

                if (!board[task.status]) {

                    board[task.status] = [];

                }

                board[task.status].push(
                    task
                );

            }
        );


        return res.status(200).json({

            success: true,

            board

        });

    }
    catch (error) {

        console.error(

            "KANBAN ERROR",

            error

        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to load board"

        });

    }

};