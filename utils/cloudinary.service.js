import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


// Configure Cloudinary using environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY 
  });


  const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;

        // ^ If an error occurs during the upload process, delete the local file
        // ^ Reason why we are unlinking the file:
        // ^ Since the file can be malicious, it's necessary to remove the file from our server
        // ^ if it fails to upload to Cloudinary. 
        // ^ We perform this action synchronously (fs.unlinkSync) because it is mandatory to 
        // ^ remove the file immediately if it is not successfully uploaded to Cloudinary.
    }
}

export {uploadOnCloudinary}