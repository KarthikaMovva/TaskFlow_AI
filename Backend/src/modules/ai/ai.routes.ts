import { Router } from "express";
import { getProjectInsightsController, generateProjectAnalysisController, getAIHistoryController, getProjectHistoryController, getProjectTrendController, getDashboardController } from "./ai.contoller";
import { protectRoute } from "../../middleware/auth.middleware";
// import aiClient from "./ai.llm";

const router = Router();

router.get(
    "/project/:projectId",
    protectRoute,
    getProjectInsightsController
);

router.post(
    "/project/:projectId/analyze",
    protectRoute,
    generateProjectAnalysisController
);

router.get(
    "/history",
    protectRoute,
    getAIHistoryController
);

router.get(
    "/project/:projectId/history",
    protectRoute,
    getProjectHistoryController
);

router.get(
    "/project/:projectId/trend",
    protectRoute,
    getProjectTrendController
);

router.get(
    "/project/:projectId/dashboard",
    protectRoute,
    getDashboardController
);


// router.get(
//     "/test-gemini",
//     async (req, res) => {

//         const result =
//             await aiClient.testGemini();


//         res.json({
//             result
//         });

//     }
// );
export default router;