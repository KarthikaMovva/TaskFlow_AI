import {
    Request,
    Response
}
    from "express";
import {
    getWorkspaceActivities
}
    from "./activity.service";
import {
    workspaceActivitySchema
} from "./activity.validation";



interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    }
}


export async function getActivityController(
    req: AuthRequest,
    res: Response
) {
    try {
        const {
            workspaceId
        } = workspaceActivitySchema.parse({
            workspaceId:
                req.params.workspaceId
        });


        const activities =
            await getWorkspaceActivities(
                workspaceId,
                req.user!.id
            );

        return res.status(200).json({
            success: true,
            activities
        });

    }


    catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch activities"

        });
    }
}