import { v2 as cloudinary } from "cloudinary";

import { env } from "./env";


/*
    Cloudinary configuration

    Purpose:
    ----------
    This connects our backend
    with Cloudinary storage.

    We use Cloudinary because:

    - Server should not store files locally
    - Files should survive deployments
    - We get CDN URLs
    - Easy deletion using publicId
*/


cloudinary.config({

    /*
        Cloudinary account name
    */
    cloud_name:
        env.CLOUDINARY_CLOUD_NAME,


    /*
        API key provided by Cloudinary
    */
    api_key:
        env.CLOUDINARY_API_KEY,


    /*
        Secret key used for authentication
    */
    api_secret:
        env.CLOUDINARY_API_SECRET,

});

console.log(
    "Cloudinary Config:",
    {
        cloud:
            env.CLOUDINARY_CLOUD_NAME,

        key:
            env.CLOUDINARY_API_KEY,

        secret:
            env.CLOUDINARY_API_SECRET
                ? "Loaded"
                : "Missing"
    }
);


export default cloudinary;