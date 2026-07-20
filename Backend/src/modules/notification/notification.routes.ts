import {
    Router
}
    from "express";


import {

    protectRoute

}
    from "../../middleware/auth.middleware";


import {

    getNotificationsController,
    markNotificationReadController,
    markAllNotificationsReadController,
    getUnreadNotificationCountController,
    deleteNotificationController

}
    from "./notification.controller";


const router = Router();



/*
    Get logged-in user notifications

    GET

    /api/notifications

*/

router.get(

    "/",

    protectRoute,

    getNotificationsController

);

router.patch(

    "/read-all",

    protectRoute,

    markAllNotificationsReadController

);

router.get(

    "/unread-count",

    protectRoute,

    getUnreadNotificationCountController

);


/*
    Mark notification read

    PATCH

    /api/notifications/:notificationId/read

*/

router.patch(

    "/:notificationId/read",

    protectRoute,

    markNotificationReadController

);

/*
    Delete Notification

    DELETE /api/notifications/:notificationId

*/

router.delete(

    "/:notificationId",

    protectRoute,

    deleteNotificationController

);


export default router;