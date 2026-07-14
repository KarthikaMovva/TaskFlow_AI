/*
    Authentication Controller

    Responsible for:

    - Receiving request
    - Calling service
    - Sending response
*/


import {
    Request,
    Response
}
    from "express";


import {
    registerUser
}
    from "./auth.service";


import {
    registerSchema
}
    from "./auth.validation";

import {
    loginSchema
}
    from "./auth.validation";


import {
    loginUser
}
    from "./auth.service";

import jwt from "jsonwebtoken";

import prisma from "../config/prisma";

import {
    generateAccessToken
}
    from "../utils/jwt";

import {
    env
}
    from "../config/env";




export async function register(

    req: Request,

    res: Response

) {


    try {


        /*
            Validate incoming data.

            If invalid,
            Zod throws error.
        */

        const data =
            registerSchema.parse(
                req.body
            );



        const user =
            await registerUser(
                data
            );



        res.status(201)
            .json({

                success: true,

                message:
                    "User registered successfully",

                user

            });



    }
    catch (error) {

        res.status(400)
            .json({

                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Registration failed"

            });

    }

}

export async function login(

    req: Request,

    res: Response

) {

    try {

        console.log("LOGIN BODY:", req.body)
        console.log("METHOD:", req.method);

        console.log("HEADERS:", req.headers);

        console.log("BODY:", req.body);
        const data =
            loginSchema.parse(
                req.body
            );



        const tokens =
            await loginUser(
                data
            );



        res.json({

            success: true,

            tokens

        });


    }
    catch (error) {

        res.status(400)
            .json({

                success: false,

                message:
                    error instanceof Error
                        ?
                        error.message
                        :
                        "Login failed"

            });

    }

}

/*
    Generate new access token
    using refresh token.

    Flow:

    Refresh Token
        |
        ↓
    Verify
        |
        ↓
    Find user
        |
        ↓
    Create new Access Token
*/


export async function refreshToken(

    req: Request,

    res: Response

) {

    try {


        const token =
            req.body.refreshToken;



        if (!token) {

            return res.status(401)
                .json({

                    success: false,

                    message:
                        "Refresh token required"

                });

        }



        /*
            Verify refresh token signature
        */

        const decoded =
            jwt.verify(

                token,

                env.JWT_REFRESH_SECRET!

            ) as {

                userId: string

            };



        /*
            Check database.

            This prevents deleted sessions
            from generating tokens.
        */

        const storedToken =
            await prisma.refreshToken.findUnique({

                where: {
                    token
                }

            });



        if (!storedToken) {

            return res.status(401)
                .json({

                    success: false,

                    message:
                        "Invalid refresh token"

                });

        }



        const accessToken =
            generateAccessToken({

                userId:
                    decoded.userId

            });



        res.json({

            success: true,

            accessToken

        });


    }
    catch (error) {


        res.status(401)
            .json({

                success: false,

                message:
                    "Refresh token expired"

            });


    }

}

export async function logout(

    req: Request,

    res: Response

) {

    try {


        const token =
            req.body.refreshToken;



        await prisma.refreshToken.delete({

            where: {
                token
            }

        });



        res.json({

            success: true,

            message:
                "Logged out successfully"

        });


    }
    catch (error) {


        res.status(400)
            .json({

                success: false,

                message:
                    "Logout failed"

            });


    }

}