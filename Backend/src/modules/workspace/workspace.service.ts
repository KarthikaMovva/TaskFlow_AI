import prisma from "../../config/prisma";


export async function createWorkspace(

    userId: string,

    name: string,

    organizationId: string

) {


    /*
        Step 1:
        Check if user belongs
        to organization
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

        throw new Error(
            "You are not a member of this organization"
        );

    }



    /*
        Step 2:
        Create workspace

        Step 3:
        Add creator as workspace owner

        Both happen inside transaction.
    */

    const workspace =
        await prisma.$transaction(

            async (tx) => {


                const newWorkspace =
                    await tx.workspace.create({

                        data: {

                            name,

                            organizationId

                        }

                    });



                await tx.workspaceMember.create({

                    data: {


                        workspaceId:
                            newWorkspace.id,


                        userId,


                        role: "OWNER"


                    }

                });



                return newWorkspace;


            });


    return workspace;

}

/*
    Get all workspaces
    inside an organization.

    Only organization members
    can access these workspaces.
*/

export async function getOrganizationWorkspaces(

    organizationId: string,

    userId: string

) {


    /*
        Verify organization membership
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

        throw new Error(
            "You are not a member of this organization"
        );

    }



    /*
        Fetch workspaces
    */

    const workspaces =
        await prisma.workspace.findMany({

            where: {

                organizationId

            },


            orderBy: {

                createdAt: "asc"

            },


            include: {

                _count: {

                    select: {

                        members: true,

                        projects: true

                    }

                }

            }

        });



    return workspaces.map((workspace) => ({

        id: workspace.id,

        name: workspace.name,

        createdAt: workspace.createdAt,

        memberCount:
            workspace._count.members,

        projectCount:
            workspace._count.projects

    }));

}

/*
    Get workspace details.

    User must be a member
    of this workspace.
*/

export async function getWorkspaceById(

    workspaceId: string,

    userId: string

) {


    /*
        Check workspace membership
    */

    const membership =
        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId,

                    workspaceId

                }

            }

        });



    if (!membership) {

        throw new Error(
            "You are not a member of this workspace"
        );

    }



    /*
        Fetch workspace details
    */

    const workspace =
        await prisma.workspace.findUnique({

            where: {

                id: workspaceId

            },


            include: {


                organization: {

                    select: {

                        id: true,

                        name: true

                    }

                },


                _count: {

                    select: {

                        members: true,

                        projects: true

                    }

                }

            }

        });



    if (!workspace) {

        throw new Error(
            "Workspace not found"
        );

    }



    return {

        id: workspace.id,

        name: workspace.name,

        createdAt: workspace.createdAt,


        organization:
            workspace.organization,


        memberCount:
            workspace._count.members,


        projectCount:
            workspace._count.projects

    };

}

/*
    Update workspace details.

    Only workspace OWNER
    can perform this action.
*/

export async function updateWorkspace(

    workspaceId: string,

    userId: string,

    name: string

) {


    /*
        Check user's workspace role
    */

    const membership =
        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId,

                    workspaceId

                }

            }

        });



    if (!membership) {

        throw new Error(
            "You are not a member of this workspace"
        );

    }



    if (membership.role !== "OWNER") {

        throw new Error(
            "Only workspace owner can update workspace"
        );

    }



    /*
        Update workspace
    */

    const workspace =
        await prisma.workspace.update({

            where: {

                id: workspaceId

            },


            data: {

                name

            }

        });



    return workspace;

}

/*
    Delete workspace.

    Only OWNER can delete.

    Uses transaction to maintain
    database consistency.
*/

export async function deleteWorkspace(

    workspaceId: string,

    userId: string

) {


    /*
        Check workspace membership
    */

    const membership =
        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId,

                    workspaceId

                }

            }

        });



    if (!membership) {

        throw new Error(
            "You are not a member of this workspace"
        );

    }



    if (membership.role !== "OWNER") {

        throw new Error(
            "Only workspace owner can delete workspace"
        );

    }



    /*
        Delete related records
        and workspace together.
    */

    await prisma.$transaction(

        async (tx) => {


            /*
                Remove workspace members
            */

            await tx.workspaceMember.deleteMany({

                where: {
                    workspaceId
                }

            });



            /*
                Remove workspace

                Projects will be handled
                after project module creation.
            */

            await tx.workspace.delete({

                where: {
                    id: workspaceId
                }

            });


        }

    );


}