/*
    PrismaClient is used to communicate with the PostgreSQL database.

    Instead of creating a new PrismaClient every time we access the database,
    we create one shared instance.

    Why?
    ----
    - Saves database connections.
    - Prevents connection leaks.
    - Recommended by Prisma documentation.
*/

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default prisma;