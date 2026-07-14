/*
    This file checks whether our application
    can communicate with PostgreSQL using Prisma.

    We fetch all users from the User table.

    Since the project is new,
    we expect an empty array [].

    If this works,
    we know

    ✓ Prisma Client works
    ✓ Database connection works
    ✓ Queries work correctly
*/

import prisma from "./config/prisma";

async function testDatabase() {
    try {
        const users = await prisma.user.findMany();

        console.log("Database Connected Successfully");
        console.log(users);

    } catch (error) {

        console.error("Database Connection Failed");
        console.error(error);

    } finally {

        await prisma.$disconnect();

    }
}

testDatabase();