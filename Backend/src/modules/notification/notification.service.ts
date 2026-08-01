import prisma from "../../config/prisma";


interface CreateNotificationInput {


    title: string;


    message: string;


    userId: string;


}


/*
    =====================================================
    CREATE NOTIFICATION
    =====================================================

    Creates notification for a user.

*/

export async function createNotification(

    data: CreateNotificationInput

) {


    return prisma.notification.create({

        data: {

            title: data.title,

            message: data.message,

            userId: data.userId

        }

    });


}



/*
    =====================================================
    GET USER NOTIFICATIONS
    =====================================================

    Fetch notifications
    belonging to logged-in user.

*/


export async function getUserNotifications(

    userId: string

) {


    return prisma.notification.findMany({

        where: {

            userId

        },


        orderBy: {

            createdAt: "desc"

        },


        take: 50

    });

}




/*
    =====================================================
    MARK NOTIFICATION AS READ
    =====================================================

*/


export async function markNotificationRead(

    notificationId: string,

    userId: string

) {


    const notification =

        await prisma.notification.findUnique({

            where: {

                id: notificationId

            }

        });



    if (!notification) {

        throw new Error(

            "Notification not found"

        );

    }



    /*
        Security check

        User can only update
        their own notifications.

    */

    if (notification.userId !== userId) {

        throw new Error(

            "You cannot update this notification"

        );

    }



    return prisma.notification.update({

        where: {

            id: notificationId

        },


        data: {

            isRead: true

        }

    });


}

/*
    =====================================================
    MARK ALL NOTIFICATIONS AS READ
    =====================================================

    Marks every unread notification
    belonging to the logged-in user
    as read.

    This is useful when the user clicks
    "Mark all as read" in the frontend.
*/

export async function markAllNotificationsRead(

    userId: string

) {

    /*
        Update all unread notifications
        for this user.
    */

    const result = await prisma.notification.updateMany({

        where: {

            userId,

            isRead: false

        },

        data: {

            isRead: true

        }

    });

    /*
        updateMany() returns

        {
            count: number
        }

        which tells us how many rows
        were updated.
    */

    return result;

}

/*
    =====================================================
    GET UNREAD NOTIFICATION COUNT
    =====================================================

    Returns the number of unread
    notifications for the logged-in user.

    Used by the frontend to display
    the notification badge.
*/

export async function getUnreadNotificationCount(

    userId: string

) {

    /*
        Count only unread notifications
        belonging to this user.
    */

    const count = await prisma.notification.count({

        where: {

            userId,

            isRead: false

        }

    });

    return count;

}

/*
    =====================================================
    DELETE NOTIFICATION
    =====================================================

    Deletes a notification.

    Security rule:

    A user can delete only
    their own notification.

*/

export async function deleteNotification(

    notificationId: string,

    userId: string

) {


    /*
        Find notification first
    */

    const notification =

        await prisma.notification.findUnique({

            where: {

                id: notificationId

            }

        });



    if (!notification) {

        throw new Error(

            "Notification not found"

        );

    }



    /*
        Security check

        Prevent user A deleting
        user B notification.

    */

    if (

        notification.userId !== userId

    ) {

        throw new Error(

            "You cannot delete this notification"

        );

    }



    /*
        Delete notification
    */

    await prisma.notification.delete({

        where: {

            id: notificationId

        }

    });



    return {

        success: true

    };

}

export async function notificationExists(

    userId: string,

    title: string,

    message: string

) {

    return prisma.notification.findFirst({

        where: {

            userId,

            title,

            message,

            isRead: false

        }

    });

}