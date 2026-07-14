/*
    JWT Utility

    Responsible for:

    1. Creating access tokens
    2. Creating refresh tokens
    3. Verifying tokens


    Why separate?

    Authentication logic becomes reusable.

    Example:

    Login
    Refresh Token API
    OAuth Login

    all need JWT creation.
*/


import jwt from "jsonwebtoken";

import { env } from "../config/env";



/*
    Payload stored inside JWT.

    We only store necessary information.

    Never store:
    - password
    - sensitive data
*/

interface TokenPayload {

    userId: string;

}



/*
    Access Token

    Used for API authorization.

    Short expiry.

    Example:
    15 minutes
*/

export function generateAccessToken(
    payload: TokenPayload
) {

    return jwt.sign(

        payload,

        env.JWT_ACCESS_SECRET!,

        {
            expiresIn: "15m"
        }

    );

}



/*
    Refresh Token

    Used to get new access tokens.

    Longer expiry.

    Example:
    7 days
*/

export function generateRefreshToken(
    payload: TokenPayload
) {

    return jwt.sign(

        payload,

        env.JWT_REFRESH_SECRET!,

        {
            expiresIn: "7d"
        }

    );

}