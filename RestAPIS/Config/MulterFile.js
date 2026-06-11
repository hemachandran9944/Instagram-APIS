const multer = require('multer');     
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');


const uploadir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadir)) {
    fs.mkdirSync(uploadir);
    console.log('Uplode Folder Create')
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage =  multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, uploadir);
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({storage});

const uploadImages = async (filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            folder: 'Instagram APIS',
            use_filename: true,
            unique_filename: false,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
        });
        fs.unlinkSync(filepath);
        return result;
    } catch (error) {
        console.log('ImageFileUplodeError', error.message)
    }
};

module.exports = {upload, uploadImages};