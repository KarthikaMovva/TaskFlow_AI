import { z } from "zod";


export const createWorkspaceSchema =
    z.object({

        name:
            z.string()
                .min(
                    3,
                    "Workspace name must contain at least 3 characters"
                ),


        organizationId:
            z.string()
                .uuid(
                    "Invalid organization id"
                )

    });


export type CreateWorkspaceInput =
    z.infer<
        typeof createWorkspaceSchema
    >;

/*
    Update workspace validation

    Only fields that are provided
    will be updated.
*/

export const updateWorkspaceSchema =
    z.object({

        name:
            z.string()
                .min(
                    3,
                    "Workspace name must contain at least 3 characters"
                )
                .optional()

    });