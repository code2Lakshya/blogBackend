const cloudinary=require('cloudinary');

exports.cloudinaryConnect=()=>{
    try{
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        })
    }
    catch(error){
        console.log('Cloudinary Connect Failure: ',error.message);
    }
}