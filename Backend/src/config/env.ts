import dotenv from "dotenv";
dotenv.config();

export const env = {

    /*
        Server port
    */
    PORT: Number(process.env.PORT) || 5000,


    /*
        PostgreSQL connection
    */
    DATABASE_URL:
        process.env.DATABASE_URL,


    /*
        JWT secrets
    */
    JWT_ACCESS_SECRET:
        process.env.JWT_ACCESS_SECRET,


    JWT_REFRESH_SECRET:
        process.env.JWT_REFRESH_SECRET,


    /*
        Cloudinary configuration

        Used for:
        - uploading files
        - deleting files
    */
    CLOUDINARY_CLOUD_NAME:
        process.env.CLOUDINARY_CLOUD_NAME,


    CLOUDINARY_API_KEY:
        process.env.CLOUDINARY_API_KEY,


    CLOUDINARY_API_SECRET:
        process.env.CLOUDINARY_API_SECRET,

};