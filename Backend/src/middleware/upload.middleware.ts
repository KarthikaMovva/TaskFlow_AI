import multer from "multer";


/*
    Store files temporarily in memory.

    Why memory storage?

    Because:
    Client
       |
       ↓
    Multer buffer
       |
       ↓
    Cloudinary

    We don't need to save files locally.
*/


const storage = multer.memoryStorage();


const upload = multer({

    storage,


    limits: {

        // Maximum file size:
        // 5MB

        fileSize: 5 * 1024 * 1024

    }

});


export default upload;