import multer from "multer";

// Configure Multer storage options
const storage = multer.diskStorage({
    // diskStorage is a storage engine provided by Multer that saves files to disk.
    // Define the destination directory where uploaded files will be stored
    destination: function (req, file, cb) {
        // Set the destination path to "../../public/temp"
        cb(null, "./public/temp");
    },
    // Define the file name for the uploaded file
    filename: function (req, file, cb) {
        // Set the file name to the original name of the uploaded file
        // we can add other functionalities as well
        // like we can change the file name 
        cb(null, file.originalname)
    }
});
// Initialize Multer middleware with the configured storage options
export const upload = multer({ 
    storage, 
})
