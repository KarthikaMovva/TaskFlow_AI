/*
    Organization Validation

    Responsible for validating
    organization creation input.
*/


import { z } from "zod";
import { Role } from "@prisma/client";



export const createOrganizationSchema =
    z.object({

        name: z
            .string()
            .min(
                3,
                "Organization name must contain at least 3 characters"
            )

    });



export type CreateOrganizationInput =
    z.infer<
        typeof createOrganizationSchema
    >;

export const updateMemberRoleSchema =
    z.object({

        role: z.nativeEnum(Role)

    });

export type UpdateMemberRoleInput =
    z.infer<typeof updateMemberRoleSchema>;