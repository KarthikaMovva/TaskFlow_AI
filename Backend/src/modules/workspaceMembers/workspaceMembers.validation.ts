import { z } from "zod";

import {
    Role
}
    from "@prisma/client";



export const addWorkspaceMemberSchema =

    z.object({

        userId:

            z.string()
                .uuid(
                    "Invalid user id"
                ),


        role:

            z.nativeEnum(Role)
                .default(Role.MEMBER)

    });


export type AddWorkspaceMemberInput =
    z.infer<
        typeof addWorkspaceMemberSchema
    >;

export const updateWorkspaceMemberRoleSchema =

    z.object({

        role:
            z.nativeEnum(Role)

    });