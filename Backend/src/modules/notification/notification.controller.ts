import {
    Request,
    Response
}
    from "express";


import {

    getUserNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    getUnreadNotificationCount,
    deleteNotification

}
    from "./notification.service";


import {

    notificationIdSchema

}
    from "./notification.validation";



interface AuthRequest extends Request {


    user?: {

        id: string;

        email: string;

    };


}



/*
    =====================================================
    GET USER NOTIFICATIONS

    GET /api/notifications

*/

export async function getNotificationsController(

    req: AuthRequest,

    res: Response

) {

    try {


        const notifications =

            await getUserNotifications(

                req.user!.id

            );



        res.json({

            success: true,

            notifications

        });


    }

    catch (error) {


        res.status(400).json({

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
    =====================================================
    MARK AS READ

    PATCH

    /api/notifications/:notificationId/read

*/


export async function markNotificationReadController(

    req: AuthRequest,

    res: Response

) {

    try {


        const {

            notificationId

        } = notificationIdSchema.parse({

            notificationId:

                req.params.notificationId

        });



        const notification =

            await markNotificationRead(

                notificationId,

                req.user!.id

            );



        res.json({

            success: true,

            notification

        });


    }

    catch (error) {


        res.status(400).json({

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
    =====================================================
    MARK ALL NOTIFICATIONS AS READ
    =====================================================

    Marks every unread notification
    for the logged-in user.
*/

export async function markAllNotificationsReadController(

    req: AuthRequest,

    res: Response

) {

    try {

        const result = await markAllNotificationsRead(

            req.user!.id

        );

        res.json({

            success: true,

            message: "All notifications marked as read",

            updated: result.count

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
    =====================================================
    GET UNREAD NOTIFICATION COUNT
    =====================================================

    Returns only the unread count
    instead of every notification.
*/

export async function getUnreadNotificationCountController(

    req: AuthRequest,

    res: Response

) {

    try {

        const count = await getUnreadNotificationCount(

            req.user!.id

        );

        res.json({

            success: true,

            count

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
    Delete Notification

    DELETE /api/notifications/:notificationId

*/

export async function deleteNotificationController(

    req: AuthRequest,

    res: Response

) {

    try {


        await deleteNotification(

            req.params.notificationId as string,

            req.user!.id

        );



        res.json({

            success: true,

            message:

                "Notification deleted successfully"

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