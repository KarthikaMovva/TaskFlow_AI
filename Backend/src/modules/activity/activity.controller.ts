import {
    Request,
    Response
}
    from "express";


import {

    getWorkspaceActivities

}
    from "./activity.service";


import {

    workspaceActivitySchema

}
    from "./activity.validation";



interface AuthRequest extends Request {


    user?: {

        id: string;

        email: string;

    }

}



/*
    =======================================================
    GET WORKSPACE ACTIVITY CONTROLLER
    =======================================================


    Endpoint:

    GET /api/activity/workspace/:workspaceId


*/


export async function getActivityController(

    req: AuthRequest,

    res: Response

) {


    try {


        /*
            Validate params

        */


        const {

            workspaceId

        } = workspaceActivitySchema.parse({

            workspaceId:

                req.params.workspaceId

        });



        /*
            Fetch activities

        */


        const activities =

            await getWorkspaceActivities(

                workspaceId,

                req.user!.id

            );



        return res.status(200).json({

            success: true,

            activities

        });


    }


    catch (error) {


        return res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ?

                    error.message

                    :

                    "Failed to fetch activities"

        });


    }

}