/*
    Permission Helper

    This file centralizes all authorization checks.

    Why?

    Instead of writing the same permission
    logic in every service, we reuse these
    helper functions.

    Future modules using this file:

    - Projects
    - Tasks
    - Comments
    - Attachments
    - AI
    - Meetings
    - Notifications
*/

import prisma from "../config/prisma";

import {
    Role
} from "@prisma/client";

/*
    Ensure the user belongs
    to the specified workspace.

    Returns the membership record
    if the user exists.

    Otherwise throws an error.
*/

export async function requireWorkspaceMember(

    workspaceId: string,

    userId: string

) {

    const membership =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    workspaceId,

                    userId

                }

            }

        });

    if (!membership) {

        throw new Error(

            "You are not a member of this workspace"

        );

    }

    return membership;

}

/*
    Ensure the user has ADMIN-level access.

    Allowed roles:

    - OWNER
    - ADMIN

    MEMBER is not allowed.
*/

export async function requireWorkspaceAdmin(

    workspaceId: string,

    userId: string

) {

    /*
        Reuse existing helper.
    */
    const membership =

        await requireWorkspaceMember(

            workspaceId,

            userId

        );



    /*
        OWNER and ADMIN
        are allowed.
    */

    if (

        membership.role !== Role.OWNER &&

        membership.role !== Role.ADMIN

    ) {

        throw new Error(

            "You don't have permission to perform this action"

        );

    }



    return membership;

}

/*
    Ensure the user is the
    workspace OWNER.
*/

export async function requireWorkspaceOwner(

    workspaceId: string,

    userId: string

) {

    const membership =

        await requireWorkspaceMember(

            workspaceId,

            userId

        );



    if (

        membership.role !== Role.OWNER

    ) {

        throw new Error(

            "Only workspace owner can perform this action"

        );

    }



    return membership;

}

/*
    Ensure user has access to a project.

    Any workspace member
    can access projects.

    Returns project details
    with workspace information.
*/

export async function requireProjectAccess(

    projectId: string,

    userId: string

) {


    /*
        Find project and
        related workspace.
    */

    const project =

        await prisma.project.findUnique({

            where: {

                id: projectId

            },

            include: {

                workspace: true

            }

        });



    if (!project) {

        throw new Error(

            "Project not found"

        );

    }



    /*
        Check workspace membership
    */

    await requireWorkspaceMember(

        project.workspaceId,

        userId

    );



    return project;

}