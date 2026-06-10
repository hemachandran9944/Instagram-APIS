const multerfile = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage =  multerfile.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multerfile({storage});

const uploadImages = async (filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            folder: 'Instagram APIS',
            use_filename: true,
            unique_filename: false,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
        });
        fs.unlinkSync(filepath);
        return await result;
    } catch (error) {
        console.log('ImageFileUplodeError', error.message)
    }
};

module.exports = {upload, uploadImages};