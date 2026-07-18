import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
const uploadFileOnCloudinary = async (localPathFile) => {
    try {
        if (!localPathFile) return;
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log("API Key loaded:", process.env.CLOUDINARY_APIKEY) // This will work now!
        const response = await cloudinary.uploader.upload(localPathFile, {
            resource_type: "auto"
        })
        fs.unlinkSync(localPathFile)
        return response
    }
    catch (error) {
        if (fs.existsSync(localPathFile)) {
             fs.unlinkSync(localPathFile)
        }
        return null
    }
}
export { uploadFileOnCloudinary }