import prisma from "../../config/prisma";

import {
    ProjectStatus,
    Role
} from "@prisma/client";
import {

    requireWorkspaceAdmin

}

    from "../../utils/permission";

/*
    Create a new project.

    Only OWNER and ADMIN
    can create projects.
*/
export async function createProject(

    name: string,

    description: string | undefined,

    workspaceId: string,

    status: ProjectStatus | undefined,

    requesterId: string

) {

    /*
        Verify requester belongs to workspace.
    */
    // const membership =
    //     await prisma.workspaceMember.findUnique({

    //         where: {

    //             userId_workspaceId: {

    //                 userId: requesterId,

    //                 workspaceId

    //             }

    //         }

    //     });

    // if (!membership) {

    //     throw new Error(
    //         "You are not a member of this workspace"
    //     );

    // }

    // /*
    //     Only OWNER and ADMIN
    //     can create projects.
    // */
    // if (

    //     membership.role !== Role.OWNER &&
    //     membership.role !== Role.ADMIN

    // ) {

    //     throw new Error(
    //         "You don't have permission to create projects"
    //     );

    // }

    /*
        Create project.
    */
    await requireWorkspaceAdmin(

        workspaceId,

        requesterId

    );
    const project =
        await prisma.project.create({

            data: {

                name,

                description,

                workspaceId,

                status:
                    status ??
                    ProjectStatus.PLANNING

            }

        });

    return project;

}

/*
    Get all projects inside a workspace.

    Every workspace member
    can view projects.
*/

export async function getWorkspaceProjects(

    workspaceId: string,

    requesterId: string

) {

    /*
        Check membership
    */

    const membership =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId: requesterId,

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
        Fetch projects
    */

    const projects =

        await prisma.project.findMany({

            where: {

                workspaceId

            },



            orderBy: {

                createdAt: "desc"

            }

        });



    return projects;

}

/*
    Get a single project.

    Any workspace member
    can view project details.
*/
export async function getProjectById(

    projectId: string,

    requesterId: string

) {

    /*
        Find project along with workspace.
    */
    const project = await prisma.project.findUnique({

        where: {
            id: projectId
        },

        include: {

            workspace: {

                select: {

                    id: true,

                    name: true

                }

            }

        }

    });

    if (!project) {

        throw new Error(
            "Project not found"
        );

    }

    /*
        Verify requester belongs
        to project's workspace.
    */
    const membership =
        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId: requesterId,

                    workspaceId: project.workspaceId

                }

            }

        });

    if (!membership) {

        throw new Error(
            "You are not a member of this workspace"
        );

    }

    return project;

}

/*
    Update project.

    OWNER and ADMIN
    can update projects.
*/

export async function updateProject(

    projectId: string,

    requesterId: string,

    data: {

        name?: string;

        description?: string;

        status?: ProjectStatus;

    }

) {

    /*
        Find project
    */

    const project =

        await prisma.project.findUnique({

            where: {

                id: projectId

            }

        });



    if (!project) {

        throw new Error(
            "Project not found"
        );

    }



    /*
        Check workspace permission
    */

    const membership =

        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId: requesterId,

                    workspaceId: project.workspaceId

                }

            }

        });



    if (!membership) {

        throw new Error(
            "You are not a member of this workspace"
        );

    }



    if (

        membership.role !== Role.OWNER &&

        membership.role !== Role.ADMIN

    ) {

        throw new Error(

            "You don't have permission to update projects"

        );

    }



    /*
        Update project
    */

    const updatedProject =

        await prisma.project.update({

            where: {

                id: projectId

            },

            data

        });



    return updatedProject;

}

/*
    Delete a project.

    Only the workspace OWNER
    can delete projects.
*/
export async function deleteProject(

    projectId: string,

    requesterId: string

) {

    /*
        Find the project
    */
    const project = await prisma.project.findUnique({

        where: {
            id: projectId
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
    const membership =
        await prisma.workspaceMember.findUnique({

            where: {

                userId_workspaceId: {

                    userId: requesterId,

                    workspaceId: project.workspaceId

                }

            }

        });

    if (!membership) {

        throw new Error(
            "You are not a member of this workspace"
        );

    }

    /*
        Only OWNER can delete
    */
    if (membership.role !== Role.OWNER) {

        throw new Error(
            "Only workspace owner can delete projects"
        );

    }

    /*
        Delete project
    */
    await prisma.project.delete({

        where: {
            id: projectId
        }

    });

}