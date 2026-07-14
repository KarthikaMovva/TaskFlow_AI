/*
    Environment Configuration File

    Purpose:
    --------
    This file loads environment variables
    and provides a single source of truth.

    Instead of accessing:

    process.env.PORT

    everywhere,

    we import:

    env.PORT

    This keeps the code clean and maintainable.
*/


import dotenv from "dotenv";


// Loads variables from .env file
dotenv.config();



/*
    Validate required environment variables.

    If these values are missing,
    the application should stop immediately.

    Why?

    It is better to fail during startup
    than after deployment.
*/

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is missing in environment variables"
    );
}



export const env = {

    /*
        Server port.
        Default value is 5000
        if PORT is not provided.
    */
    PORT: Number(process.env.PORT) || 5000,


    /*
        PostgreSQL connection string.
        Used by Prisma.
    */
    DATABASE_URL: process.env.DATABASE_URL,

    JWT_ACCESS_SECRET:
        process.env.JWT_ACCESS_SECRET,


    JWT_REFRESH_SECRET:
        process.env.JWT_REFRESH_SECRET,

};