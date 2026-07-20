import cloudinary from "../config/cloudinary.js";
import fs from "fs";


const IMAGE_MIME_PREFIX = "image/";
const VIDEO_MIME_PREFIX = "video/";
const AUDIO_MIME_PREFIX = "audio/"; // Cloudinary treats audio as "video" type
const PDF_MIME_TYPE = "application/pdf";

function resolveResourceType(mimeType) {
    if (mimeType?.startsWith(IMAGE_MIME_PREFIX)) return "image";
    if (mimeType?.startsWith(VIDEO_MIME_PREFIX) || mimeType?.startsWith(AUDIO_MIME_PREFIX)) return "video";
    if (mimeType === PDF_MIME_TYPE) return "image";
    return "raw";
}

const uploadOnCloudinary = async (localFilePath, mimeType, originalFilename, uploadFolder = "resurf") => {
    try{
        if(!localFilePath){
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resolveResourceType(mimeType),
            folder: uploadFolder,
            
            filename_override: originalFilename,
            use_filename: true,
            unique_filename: false
        });
        

        // Delete the temporary local file
        fs.unlinkSync(localFilePath);
        return response;

    }
    catch(error){
        // Delete local file if upload fails
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        throw error;
    }
};

const deleteFromCloudinary = async (publicId, resourceType) => {
    try {

        if (!publicId) return;


        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
            //type: "upload"
        });


    } catch (error) {
        console.error("Cloudinary delete failed:", error);
        throw error;
    }
};
export { uploadOnCloudinary,deleteFromCloudinary };