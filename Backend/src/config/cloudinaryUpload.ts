import cloudinary from "../config/cloudinary";


export function uploadToCloudinary(
    fileBuffer: Buffer
): Promise<any> {


    return new Promise(
        (resolve, reject) => {
            const uploadStream =
                cloudinary.uploader.upload_stream(
                    {
                        folder:
                            "taskflow/attachments",
                        resource_type:
                            "image",
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