import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})


const uploadonCloudinary = async(localFilePath) =>{
    try {
        if(!localFilePath) {
            return null;
        }
        //uploading the file

    const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File has been uploaded on cloudinary", response.url)
        fs.unlinkSync(localFilePath)
        return response;

    }catch(e) {
        fs.unlinkSync(localFilePath)
        return null;

    }
}


const deleteFileCloudinary = async(publicId, type) =>{
    try{
    const response = await cloudinary.uploader.destroy(publicId,{
        resource_type: type
    })
    console.log("Image deleted successfully!")
    
}catch(e) {
    console.log("Error deleting the file from cloudinary", e)

}

}

export {uploadonCloudinary, deleteFileCloudinary}