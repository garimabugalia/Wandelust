const cloudinary = require('cloudinary').v2;
const { Model } = require('mongoose');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV/Listings',
    allowed_formats: ["png","jpg","jpeg"], // supports promises as wel
    
  },
});

// 👤 Storage for User Profile Images
const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wanderlust_DEV/Users",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

module.exports={
    cloudinary,
    storage,
    userStorage,
};