import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

    // Configuration
    cloudinary.config({ 
        cloud_name:  process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) {
                throw new Error('No file path provided');
            }
            //uploading a file on cloudinary 
            const response =  await cloudinary.uploader.upload(localfilePath,{})//we get one option resourse type and take it as raw (any type ) instead of specifying 
            console.log('File uploaded successfully on cloudinary', response.url);
            return response;
        } catch (error) {
            
            fs.unlinkSync(localFilePath); // Delete the file if upload fails
            return null
        }
    }

    export default uploadOnCloudinary;