import {
    Request,
    Response
}
    from "express";

import prisma from "../../config/prisma";


/**
 * Get Kanban board of a project
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

    req: Request,

    res: Response

) => {


    try {


        const {
            projectId
        } = req.params;



        const tasks = await prisma.task.findMany({

            where: {

                projectId

            },


            orderBy: {

                position: "asc"

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



        const board = {

            TODO: [],

            IN_PROGRESS: [],

            IN_REVIEW: [],

            DONE: []

        };



        tasks.forEach(task => {


            board[task.status].push(task);


        });



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