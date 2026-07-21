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

        const decoded =
            jwt.verify(

                token,

                env.JWT_ACCESS_SECRET!

            ) as {

                userId: string;

            };

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