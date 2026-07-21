import { z } from "zod";


export const workspaceActivitySchema = z.object({
    workspaceId:

        z
            .string()
            .uuid(
                "Invalid workspace id"
            )

});


export type WorkspaceActivityInput =
    z.infer<
        typeof workspaceActivitySchema
    >;