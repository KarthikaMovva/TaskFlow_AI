import {
    Request,
    Response,
    NextFunction
} from "express";

import aiService from "./ai.service";
import aiHistoryService from "./ai.history.service";


export const getProjectInsightsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            projectId
        } = req.params;
        const userId =
            req.user.id;

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

export const generateProjectAnalysisController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {


    try {
        const {
            projectId
        } = req.params;



        const userId =
            req.user.id;



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

}
export const getAIHistoryController = async (
    req,
    res,
    next
) => {

    try {
        const history =
            await aiService.getHistory(
                req.user.id
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

export const getProjectHistoryController = async (
    req,
    res,
    next
) => {

    try {

        const history =
            await aiHistoryService.getProjectHistory(
                req.params.projectId,
                req.user.id
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

export const getProjectTrendController =
    async (req, res, next) => {

        try {
            const result =
                await aiService.getProjectTrend(
                    req.params.projectId,
                    req.user.id
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

export async function getDashboardController(

    req: AuthRequest,

    res: Response

) {

    try {

        const dashboard =
            await aiService.getDashboard(

                req.params.projectId,

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