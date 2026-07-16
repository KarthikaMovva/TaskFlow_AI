import { Router } from "express";

import {

    protectRoute

} from "../../middleware/auth.middleware";

import {

    createCommentController,
    getTaskCommentsController,
    updateCommentController,
    deleteCommentController

} from "./comment.controller";

const router = Router();

/*
    POST /api/tasks/:taskId/comments
*/

router.post(

    "/tasks/:taskId/comments",

    protectRoute,

    createCommentController

);

/*
    GET /api/tasks/:taskId/comments
*/

router.get(

    "/tasks/:taskId/comments",

    protectRoute,

    getTaskCommentsController

);

/*
    PATCH /api/comments/:commentId
*/

router.patch(

    "/:commentId",

    protectRoute,

    updateCommentController

);

/*
    DELETE /api/comments/:commentId
*/

router.delete(

    "/:commentId",

    protectRoute,

    deleteCommentController

);

export default router;