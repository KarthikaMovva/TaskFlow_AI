/*
    Express Application Configuration

    This file creates and configures our Express app.

    Responsibilities:
    -----------------
    1. Initialize Express
    2. Add global middleware
    3. Register routes
    4. Handle errors


    Important:
    This file DOES NOT start the server.

    Starting the server happens in server.ts.
*/


import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes
    from "../src/modules/auth.routes";
import {
    protectRoute,
    AuthRequest
}
    from "./middleware/auth.middleware";
import organizationRoutes
    from "./modules/organization/organization.routes";
import workspaceRoutes
    from "./modules/workspace/workspace.routes";
import workspaceMemberRoutes
    from "./modules/workspaceMembers/workspaceMembers.routes";
import projectRoutes
    from "./modules/project/project.routes";
import taskRoutes
    from "./modules/task/task.routes";
import commentRoutes
    from "./modules/comment/comment.routes";
import KanbanRoutes
    from "./modules/kanban/kanban.routes";
import activityRoutes
    from "./modules/activity/activity.routes";
import notificationRoutes
    from "./modules/notification/notification.routes";


const app = express();
app.use(
    helmet()
);

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(
    express.json()
);

app.use(
    cookieParser()
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/organizations",
    organizationRoutes
);

app.use(
    "/api/workspaces",
    workspaceRoutes
);
app.use(
    "/api/workspaces",
    workspaceMemberRoutes
);

app.use(
    "/api/projects",
    projectRoutes
);

app.use(
    "/api/tasks",
    taskRoutes
);
app.use(
    "/api/comments",
    commentRoutes
);
// app.use(
//     "/api",
//     attachmentRoutes
// );
app.use(
    "/api/kanban",
    KanbanRoutes
);
app.use(
    "/api/activity",
    activityRoutes
);
app.use(
    "/api/notifications",
    notificationRoutes
);

app.get(
    "/",
    (req, res) => {

        res.json({
            message:
                "TaskFlow AI Backend Running 🚀"
        });

    }
);

app.get(
    "/api/test-auth",
    protectRoute,
    (req: AuthRequest, res) => {


        res.json({

            message:
                "Protected route accessed",

            user: req.user

        });


    }
);


export default app;