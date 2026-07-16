import { Router } from "express";
import { getBoard } from "./kanban.controller";
import {
    protectRoute
}
    from "../../middleware/auth.middleware";

const router = Router();

/**
 * Returns all tasks grouped by status.
 */
router.get(
    "/:projectId",
    protectRoute,
    getBoard
);

export default router;