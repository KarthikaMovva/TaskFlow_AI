/*
    Authentication Middleware

    Purpose:
    ----------
    Protect private routes.

    Responsibilities:

    1. Read JWT token
    2. Verify token validity
    3. Identify user
    4. Attach user information
       to request object


    Example:

    GET /api/projects

    Without token:
         Unauthorized


    With valid token:
        Continue
*/


import {
    Request,
    Response,
    NextFunction
}
    from "express";


import jwt from "jsonwebtoken";


import {
    env
}
    from "../config/env";


import prisma
    from "../config/prisma";



export interface AuthRequest
    extends Request {

    user?: {

        id: string;

        email: string;

        name: string;

    }

}




export async function protectRoute(

    req: AuthRequest,

    res: Response,

    next: NextFunction

) {


    try {


        /*
            Authorization header format:

            Bearer token_here

            Example:

            Authorization:
            Bearer eyJhbGc...
        */


        const authHeader =
            req.headers.authorization;



        if (!authHeader) {

            return res.status(401)
                .json({

                    success: false,

                    message:
                        "No token provided"

                });

        }



        /*
            Extract token.

            Splitting:

            Bearer abc123

            becomes:

            abc123
        */

        const token =
            authHeader.split(" ")[1];



        if (!token) {

            return res.status(401)
                .json({

                    success: false,

                    message:
                        "Invalid token format"

                });

        }



        /*
            Verify JWT signature.

            If token was modified,
            verification fails.
        */

        const decoded =
            jwt.verify(

                token,

                env.JWT_ACCESS_SECRET!

            ) as {

                userId: string;

            };



        /*
            Fetch user from database.

            This confirms:

            - User exists
            - Account is active
        */

        const user =
            await prisma.user.findUnique({

                where: {
                    id: decoded.userId
                }

            });



        if (!user) {

            return res.status(401)
                .json({

                    success: false,

                    message:
                        "User not found"

                });

        }



        /*
            Attach user information.

            Now controllers can access:

            req.user
        */

        req.user = {

            id: user.id,

            email: user.email,

            name: user.name

        };



        next();


    }
    catch (error) {


        return res.status(401)
            .json({

                success: false,

                message:
                    "Unauthorized"

            });


    }


}