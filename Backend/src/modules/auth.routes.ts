import {
    Router
}
    from "express";
import {
    register
}
    from "./auth.controller";
import {
    login
} from "./auth.controller";
import {
    refreshToken
} from "./auth.controller";
import {
    logout
} from "./auth.controller";



const router =
    Router();



router.post(
    "/register",
    register
);
router.post(
    "/login",
    login,
    (req, res) => {

        console.log("ROUTE BODY:", req.body);

        res.json({
            received: req.body
        });

    }
);
router.post(
    "/refresh",
    refreshToken
);
router.post(
    "/logout",
    logout
);



export default router;