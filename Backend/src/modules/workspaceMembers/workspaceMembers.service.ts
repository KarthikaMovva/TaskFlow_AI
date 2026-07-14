import prisma from "../../config/prisma";

import {
    Role
}
    from "@prisma/client";



/*
    Add user to workspace.

    Only workspace OWNER
    can perform this action.
*/


export async function addMember(

    workspaceId: string,

    requesterId: string,

    userId: string,

    role: Role

) {


    /*
        Check requester permission
    */

    const requester =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId: requesterId,

                    workspaceId

                }

            }

        });



    if (!requester) {

        throw new Error(
            "You are not a workspace member"
        );

    }



    if (requester.role !== Role.OWNER) {

        throw new Error(
            "Only workspace owner can add members"
        );

    }



    /*
        Check if user already exists
        in workspace
    */

    const existingMember =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId,

                    workspaceId

                }

            }

        });



    if (existingMember) {

        throw new Error(
            "User already belongs to this workspace"
        );

    }



    /*
        Verify user exists
    */

    const user =

        await prisma.user.findUnique({

            where: {
                id: userId
            }

        });



    if (!user) {

        throw new Error(
            "User not found"
        );

    }



    /*
        Create membership
    */

    const member =

        await prisma.workspaceMember.create({

            data: {

                workspaceId,

                userId,

                role

            }

        });



    return member;

}

/*
    Get all workspace members.

    Any workspace member
    can view the team list.
*/

export async function getWorkspaceMembers(

    workspaceId: string,

    userId: string

) {


    /*
        Check whether user belongs
        to this workspace
    */

    const requester =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId,

                    workspaceId

                }

            }

        });



    if (!requester) {

        throw new Error(
            "You are not a member of this workspace"
        );

    }



    /*
        Fetch workspace members

        Include user details.
    */

    const members =

        await prisma.workspaceMember.findMany({

            where: {

                workspaceId

            },


            include: {

                user: {

                    select: {

                        id: true,

                        name: true,

                        email: true,

                        avatar: true

                    }

                }

            },


            orderBy: {

                joinedAt: "asc"

            }

        });



    return members;

}

/*
    Update workspace member role.

    Only workspace OWNER
    can update roles.
*/

export async function updateMemberRole(

    workspaceId: string,

    requesterId: string,

    memberId: string,

    role: Role

) {


    /*
        Check requester permission
    */

    const requester =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId: requesterId,

                    workspaceId

                }

            }

        });



    if (!requester) {

        throw new Error(
            "You are not a workspace member"
        );

    }



    if (requester.role !== Role.OWNER) {

        throw new Error(
            "Only workspace owner can change roles"
        );

    }



    /*
        Find target member
    */

    const member =

        await prisma.workspaceMember.findUnique({

            where: {
                id: memberId
            }

        });



    if (!member) {

        throw new Error(
            "Member not found"
        );

    }



    /*
        Prevent owner self modification
    */

    if (member.userId === requesterId) {

        throw new Error(
            "Owner cannot change own role"
        );

    }



    /*
        Update role
    */

    const updatedMember =

        await prisma.workspaceMember.update({

            where: {
                id: memberId
            },


            data: {

                role

            }

        });



    return updatedMember;

}

/*
    Remove member from workspace.

    Only workspace OWNER
    can remove members.
*/

export async function removeMember(

    workspaceId: string,

    requesterId: string,

    memberId: string

) {


    /*
        Check requester permission
    */

    const requester =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId: requesterId,

                    workspaceId

                }

            }

        });



    if (!requester) {

        throw new Error(
            "You are not a workspace member"
        );

    }



    if (requester.role !== Role.OWNER) {

        throw new Error(
            "Only workspace owner can remove members"
        );

    }



    /*
        Find member to remove
    */

    const member =

        await prisma.workspaceMember.findUnique({

            where: {
                id: memberId
            }

        });



    if (!member) {

        throw new Error(
            "Member not found"
        );

    }



    /*
        Prevent owner removing themselves
    */

    if (member.userId === requesterId) {

        throw new Error(
            "Owner cannot remove themselves"
        );

    }



    /*
        Delete membership
    */

    await prisma.workspaceMember.delete({

        where: {
            id: memberId
        }

    });



}