import {
    Request,
    Response,
    NextFunction
} from "express";

import aiService from "./ai.service";
import aiHistoryService from "./ai.history.service";

/**
 * Express Request with authenticated user information.
 *
 * `user` is optional here so the controller remains compatible
 * with Express RequestHandler typing.
 *
 * The authentication middleware guarantees that user exists
 * before these controllers are executed.
 */
type AuthenticatedRequest = Request & {
    user?: {
        id: string;
    };
};

/**
 * Safely extract a route parameter as a string.
 *
 * Express can type route parameters as string | string[]
 * depending on the installed Express type definitions.
 */
const getParam = (value: string | string[]): string => {
    return Array.isArray(value) ? value[0] : value;
};


/**
 * Get project AI insights
 */
export const getProjectInsightsController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const projectId =
            getParam(req.params.projectId);

        const userId =
            req.user!.id;

        const data =
            await aiService.getProjectInsights(
                projectId,
                userId
            );

        res.status(200).json({
            success: true,
            data
        });

    }
    catch (error) {

        next(error);

    }
};


/**
 * Generate new AI project analysis
 */
export const generateProjectAnalysisController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const projectId =
            getParam(req.params.projectId);

        const userId =
            req.user!.id;

        const analysis =
            await aiService.generateProjectAnalysis(
                projectId,
                userId
            );

        res.status(201).json({

            success: true,

            message:
                "AI analysis generated successfully",

            data: analysis

        });

    }
    catch (error) {

        next(error);

    }
};


/**
 * Get AI history for the authenticated user
 */
export const getAIHistoryController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const history =
            await aiHistoryService.getUserAIHistory(
                req.user!.id
            );

        res.status(200).json({

            success: true,

            data: history

        });

    }
    catch (error) {

        next(error);

    }
};


/**
 * Get AI history for a specific project
 */
export const getProjectHistoryController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const projectId =
            getParam(req.params.projectId);

        const history =
            await aiHistoryService.getProjectHistory(
                projectId
            );

        res.status(200).json({

            success: true,

            data: history

        });

    }
    catch (error) {

        next(error);

    }
};


/**
 * Get project AI trend
 */
export const getProjectTrendController = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const projectId =
            getParam(req.params.projectId);

        const result =
            await aiService.getProjectTrend(
                projectId,
                req.user!.id
            );

        res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        next(error);

    }
};


/**
 * Get project AI dashboard
 */
export async function getDashboardController(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {

    try {

        const projectId =
            getParam(req.params.projectId);

        const dashboard =
            await aiService.getDashboard(
                projectId,
                req.user!.id
            );

        res.status(200).json({

            success: true,

            data: dashboard

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message:
                error instanceof Error
                    ? error.message
                    : "Internal server error"

        });

    }
}