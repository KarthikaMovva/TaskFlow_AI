import prisma from "../../config/prisma";

import {
    createNotification
}
    from "../notification/notification.service";


/*
    =======================================================
    Activity Service

    Central event handler.

    Every important action in the system
    should come here.

    Examples:

    TASK_CREATED
    TASK_ASSIGNED
    COMMENT_CREATED
    TASK_DELETED

    This service will:

    1. Save activity history
    2. Create notification if required

*/


interface CreateActivityInput {


    /*
        Type of action

        Example:

        TASK_CREATED
        COMMENT_CREATED

    */

    action: string;



    /*
        Human readable message

    */

    description?: string;



    /*
        Related entity

        Example:

        TASK
        COMMENT

    */

    entityType?: string;



    /*
        Related entity id

    */

    entityId?: string;



    /*
        User who performed action

    */

    userId: string;



    /*
        Workspace where action happened

    */

    workspaceId: string;



    /*
        Optional notification receiver

        Example:

        Task assigned to Rahul

        notifyUserId = Rahul

    */

    notifyUserId?: string;


}



/*
    =======================================================
    CREATE ACTIVITY

    Creates activity log.

    If notifyUserId exists,
    also creates notification.

*/


export async function createActivity(

    data: CreateActivityInput

) {



    /*
        1.
        Save activity history

    */

    const activity =

        await prisma.activity.create({

            data: {


                action: data.action,


                description: data.description,


                entityType: data.entityType,


                entityId: data.entityId,


                userId: data.userId,


                workspaceId: data.workspaceId


            }

        });





    /*
        2.
        Create notification if required


        Example:

        Task assigned

        User A assigns task to User B

        notifyUserId = User B

    */


    if (data.notifyUserId) {


        await createNotification({

            title: data.action,


            message:

                data.description ??

                "New activity",


            userId: data.notifyUserId

        });


    }




    return activity;


}