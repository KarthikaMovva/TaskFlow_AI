import { Request, Response } from "express";

import {

    createCommentSchema,
    updateCommentSchema

} from "./comment.validation";

import {

    createComment,
    getTaskComments,
    updateComment,
    deleteComment

} from "./comment.service";

interface AuthRequest extends Request {

    user?: {

        id: string;

        email: string;

    };

}

export async function createCommentController(

    req: AuthRequest,

    res: Response

) {

    try {

        const data =

            createCommentSchema.parse(

                req.body

            );

        const comment =

            await createComment(

                req.params.taskId as string,

                data,

                req.user!.id

            );

        res.status(201).json({

            success: true,

            message: "Comment created successfully",

            comment

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed"

        });

    }

}

/*
    Get Task Comments
*/

export async function getTaskCommentsController(

    req: AuthRequest,

    res: Response

) {

    try {

        const comments =

            await getTaskComments(

                req.params.taskId as string,

                req.user!.id

            );

        res.json({

            success: true,

            comments

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed"

        });

    }

}

/*
    Update Comment Controller
*/

export async function updateCommentController(

    req: AuthRequest,

    res: Response

) {

    try {

        const data =

            updateCommentSchema.parse(

                req.body

            );

        const comment =

            await updateComment(

                req.params.commentId as string,

                data,

                req.user!.id

            );

        res.json({

            success: true,

            message: "Comment updated successfully",

            comment

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed"

        });

    }

}

/*
    Delete Comment Controller
*/

export async function deleteCommentController(

    req: AuthRequest,

    res: Response

) {

    try {

        await deleteComment(

            req.params.commentId as string,

            req.user!.id

        );

        res.json({

            success: true,

            message: "Comment deleted successfully"

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message:

                error instanceof Error

                    ? error.message

                    : "Failed"

        });

    }

}