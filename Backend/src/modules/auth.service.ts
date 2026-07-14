/*
    Authentication Business Logic

    This layer communicates with:

    - Prisma
    - Password utilities
    - JWT utilities

*/


import prisma from "../config/prisma";

import {
    hashPassword
}
    from "../utils/password";

import {
    LoginInput,
    RegisterInput
}
    from "./auth.validation";
import {
    comparePassword
}
    from "../utils/password";


import {
    generateAccessToken,
    generateRefreshToken
}
    from "../utils/jwt";



export async function registerUser(
    data: RegisterInput
) {


    /*
        Check whether email already exists.

        Because email is unique,
        duplicate accounts are not allowed.
    */

    const existingUser =
        await prisma.user.findUnique({

            where: {
                email: data.email
            }

        });



    if (existingUser) {

        throw new Error(
            "Email already registered"
        );

    }



    /*
        Convert plain password
        into encrypted hash.

        We NEVER store:

        password123 ❌

        We store:

        $2b$10$.... ✅
    */

    const hashedPassword =
        await hashPassword(
            data.password
        );



    /*
        Create user in PostgreSQL.
    */

    const user =
        await prisma.user.create({

            data: {

                name: data.name,

                email: data.email,

                password: hashedPassword

            }

        });



    /*
        Remove password before returning.

        Password hash should never
        go back to client.
    */

    const {
        password,
        ...safeUser
    } = user;



    return safeUser;

}

export async function loginUser(
    data: LoginInput
) {


    const user =
        await prisma.user.findUnique({

            where: {
                email: data.email
            }

        });



    if (!user) {

        throw new Error(
            "Invalid credentials"
        );

    }



    const passwordMatch =
        await comparePassword(

            data.password,

            user.password

        );



    if (!passwordMatch) {

        throw new Error(
            "Invalid credentials"
        );

    }



    const accessToken =
        generateAccessToken({

            userId: user.id

        });



    const refreshToken =
        generateRefreshToken({

            userId: user.id

        });



    await prisma.refreshToken.create({

        data: {

            token: refreshToken,

            userId: user.id,

            expiresAt:
                new Date(
                    Date.now()
                    +
                    7 * 24 * 60 * 60 * 1000
                )

        }

    });



    return {

        accessToken,

        refreshToken

    };

}