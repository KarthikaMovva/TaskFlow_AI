/*
    Testing whether environment variables
    are loaded correctly.
*/


import { env } from "./config/env";


console.log("PORT:", env.PORT);

console.log(
    "DATABASE URL EXISTS:",
    Boolean(env.DATABASE_URL)
);