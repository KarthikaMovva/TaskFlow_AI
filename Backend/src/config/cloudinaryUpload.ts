import cloudinary from "../config/cloudinary";


/*
    Upload file buffer to Cloudinary

    Why upload_stream?

    Multer stores uploaded files in memory.
    We directly stream that buffer to Cloudinary
    instead of saving files on our server.
*/


export function uploadToCloudinary(

    fileBuffer: Buffer

): Promise<any> {


    return new Promise(

        (resolve, reject) => {


            const uploadStream =

                cloudinary.uploader.upload_stream(

                    {

                        /*
                            Folder structure inside Cloudinary

                            Example:

                            taskflow
                              |
                              attachments
                                  |
                                  image.png
                        */
                        folder:
                            "taskflow/attachments",


                        /*
                            Tell Cloudinary what
                            type of file this is.
                        */
                        resource_type:
                            "image",


                        /*
                            This makes the upload signed.
                            Since we are using backend API keys,
                            this is the correct mode.
                        */
                        type:
                            "upload"

                    },


                    (error, result) => {


                        if (error) {

                            console.log(
                                "Cloudinary Error:",
                                error
                            );

                            reject(error);

                        }


                        else {

                            resolve(result);

                        }


                    }

                );


            uploadStream.end(fileBuffer);


        }

    );

}