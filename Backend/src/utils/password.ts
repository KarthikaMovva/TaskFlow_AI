/*
    Password Utility

    Responsible for:

    1. Hashing passwords
    2. Comparing passwords

    Why separate?

    Authentication logic becomes cleaner.

*/


import bcrypt from "bcrypt";



/*
    Number of hashing rounds.

    Higher number:
    - More secure
    - More processing time

    10-12 is common in applications.
*/

const SALT_ROUNDS = 10;



/*
    Hash plain password.

    Example:

    Input:
    password123

    Output:
    $2b$10$xxxxxxxx
*/

export async function hashPassword(
    password: string
) {

    return await bcrypt.hash(
        password,
        SALT_ROUNDS
    );

}



/*
    Compare login password.

    Example:

    User enters:
    password123

    Database contains:
    hashed password

*/

export async function comparePassword(
    password: string,
    hashedPassword: string
) {

    return await bcrypt.compare(
        password,
        hashedPassword
    );

}