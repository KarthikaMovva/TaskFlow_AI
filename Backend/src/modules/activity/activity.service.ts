import prisma from "../../config/prisma";

import {
    createNotification
}
    from "../notification/notification.service";

interface CreateActivityInput {

    action: string;
    description?: string;
    entityType?: string;
    entityId?: string;
    userId: string;
    workspaceId: string;
    notifyUserId?: string;


}

export async function createActivity(

    data: CreateActivityInput

) {

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