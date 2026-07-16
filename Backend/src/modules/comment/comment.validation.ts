import { z } from "zod";

/*
    Create Comment Validation
*/

export const createCommentSchema = z.object({

    message: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(1000, "Comment is too long")

});

export type CreateCommentInput =
    z.infer<typeof createCommentSchema>;

/*
    Update Comment Validation
*/

export const updateCommentSchema = z.object({

    message: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(1000, "Comment is too long")

});

export type UpdateCommentInput =
    z.infer<typeof updateCommentSchema>;