/*
    Server Entry Point

    Responsibilities:
    -----------------

    1. Import Express application
    2. Read environment configuration
    3. Start HTTP server


    app.ts creates the application.

    server.ts runs it.
*/


import app from "./app";

import { env } from "./config/env";



/*
    Start HTTP server.

    The application will listen
    on the PORT defined in .env

*/
app.listen(
    env.PORT,
    () => {

        console.log(
            `
            🚀 TaskFlow AI Server Started

            Port:
            ${env.PORT}

            Environment:
            Development
            `
        );

    }
);