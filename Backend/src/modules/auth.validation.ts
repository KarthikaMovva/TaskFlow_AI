/*
    Authentication Request Validation

    Purpose:
    ----------
    This file contains rules for incoming
    authentication data.

    We use Zod because:

    - TypeScript friendly
    - Runtime validation
    - Clear error messages
*/


import { z } from "zod";



/*
    Register validation schema

    Defines what a valid user registration
    request should look like.
*/

export const registerSchema = z.object({

    /*
        User's display name

        Example:
        Karthika
    */
    name: z
        .string()
        .min(
            3,
            "Name must contain at least 3 characters"
        ),



    /*
        Email validation

        Zod checks whether
        the format is valid.
    */
    email: z
        .string()
        .email(
            "Invalid email format"
        ),



    /*
        Password rules

        Minimum 8 characters.

        Later we can add:
        - uppercase requirement
        - number requirement
        - special characters
    */
    password: z
        .string()
        .min(
            8,
            "Password must contain at least 8 characters"
        )

});



/*
    TypeScript type generated
    from validation schema.

    This avoids manually writing:

    interface RegisterInput {}

*/
export type RegisterInput =
    z.infer<typeof registerSchema>;

export const loginSchema = z.object({

    email: z
        .string()
        .email(
            "Invalid email"
        ),


    password: z
        .string()
        .min(
            8,
            "Password is required"
        )

});


export type LoginInput =
    z.infer<typeof loginSchema>;