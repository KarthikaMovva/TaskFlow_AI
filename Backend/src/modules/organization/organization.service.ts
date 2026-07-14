/*
    Organization Business Logic

    Handles:
    - Database operations
    - Creating organization
    - Adding owner membership

*/


import prisma
    from "../../config/prisma";


import {
    CreateOrganizationInput
}
    from "./organization.validation";
import { Role } from "@prisma/client";



export async function createOrganization(

    userId: string,

    data: CreateOrganizationInput

) {


    /*
        Create organization and owner
        membership together.

        Transaction ensures:

        Either both succeed,
        or both fail.

    */

    const organization =
        await prisma.$transaction(

            async (tx) => {


                const org =
                    await tx.organization.create({

                        data: {

                            name: data.name,

                            ownerId: userId

                        }

                    });



                await tx.organizationMember.create({

                    data: {

                        organizationId: org.id,

                        userId: userId,

                        role: "OWNER"

                    }

                });



                return org;


            }

        );



    return organization;

}

/*
    Get all organizations
    where the logged-in user is a member.

    Flow:

    User
      ↓
    OrganizationMember
      ↓
    Organization
*/

export async function getUserOrganizations(
    userId: string
) {

    const memberships =
        await prisma.organizationMember.findMany({

            where: {
                userId
            },

            include: {

                organization: true

            }

        });


    /*
        Transform the response.

        Instead of returning the entire
        OrganizationMember object,
        return only useful frontend data.
    */

    return memberships.map((membership) => ({

        id: membership.organization.id,

        name: membership.organization.name,

        role: membership.role,

        createdAt: membership.organization.createdAt

    }));

}

/*
    Get details of a single organization.

    Before returning data, verify that
    the authenticated user belongs to it.
*/

export async function getOrganizationById(
    organizationId: string,
    userId: string
) {

    /*
        Check if the user is a member
        of this organization.
    */
    const membership = await prisma.organizationMember.findUnique({
        where: {
            organizationId_userId: {
                organizationId,
                userId
            }
        }
    });

    if (!membership) {
        throw new Error("Access denied");
    }

    /*
        Fetch organization details.
    */
    const organization = await prisma.organization.findUnique({
        where: {
            id: organizationId
        },

        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },

            _count: {
                select: {
                    members: true,
                    workspaces: true
                }
            }
        }
    });

    if (!organization) {
        throw new Error("Organization not found");
    }

    return {
        id: organization.id,
        name: organization.name,
        createdAt: organization.createdAt,
        owner: organization.owner,
        memberCount: organization._count.members,
        workspaceCount: organization._count.workspaces
    };

}

/*
    Get all members of an organization.

    Only organization members
    can access this endpoint.
*/

export async function getOrganizationMembers(
    organizationId: string,
    userId: string
) {

    /*
        Verify membership first.
    */
    const membership =
        await prisma.organizationMember.findUnique({

            where: {
                organizationId_userId: {
                    organizationId,
                    userId
                }
            }

        });

    if (!membership) {
        throw new Error("Access denied");
    }

    /*
        Fetch all members with user details.
    */
    const members =
        await prisma.organizationMember.findMany({

            where: {
                organizationId
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

    /*
        Format response.
    */
    return members.map((member) => ({
        membershipId: member.id,      // OrganizationMember ID
        userId: member.user.id,       // User ID
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar,
        role: member.role,
        joinedAt: member.joinedAt
    }));

}

/*
    Change role of an organization member.

    Only OWNER can perform this action.
*/

export async function updateMemberRole(

    organizationId: string,

    requesterId: string,

    memberId: string,

    role: Role

) {

    /*
        Verify requester role.
    */

    const requester =
        await prisma.organizationMember.findUnique({

            where: {
                organizationId_userId: {
                    organizationId,
                    userId: requesterId
                }
            }

        });



    if (!requester) {
        throw new Error("Access denied");
    }



    if (requester.role !== "OWNER") {
        throw new Error("Only owner can change roles");
    }



    const member =
        await prisma.organizationMember.findUnique({

            where: {
                id: memberId
            }

        });



    if (!member) {
        throw new Error("Member not found");
    }



    /*
        Prevent owner from changing
        their own role accidentally.
    */

    if (member.userId === requesterId) {
        throw new Error(
            "Owner cannot change own role"
        );
    }



    const updatedMember =
        await prisma.organizationMember.update({

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
    Remove a member from an organization.

    Only the OWNER can remove members.
*/

export async function removeMember(
    organizationId: string,
    requesterId: string,
    memberId: string
) {

    // Verify requester is part of organization
    const requester =
        await prisma.organizationMember.findUnique({

            where: {
                organizationId_userId: {
                    organizationId,
                    userId: requesterId
                }
            }

        });

    if (!requester) {
        throw new Error("Access denied");
    }

    if (requester.role !== "OWNER") {
        throw new Error("Only owner can remove members");
    }

    // Find member
    const member =
        await prisma.organizationMember.findUnique({

            where: {
                id: memberId
            }

        });

    if (!member) {
        throw new Error("Member not found");
    }

    // Prevent owner from removing themselves
    if (member.userId === requesterId) {
        throw new Error("Owner cannot remove themselves");
    }

    // Delete member
    await prisma.organizationMember.delete({

        where: {
            id: memberId
        }

    });

    return;
}