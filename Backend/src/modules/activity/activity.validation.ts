import { z } from "zod";


/*
    =======================================================
    Activity Validation Schema
    =======================================================

    Validates incoming activity requests.

    Currently used for:

    GET workspace activity


    Future expansion:

    - pagination
    - date filtering
    - action filtering

*/


/*
    Validate workspace id
*/

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