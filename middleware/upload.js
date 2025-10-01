  import multer from "multer";
  import { CloudinaryStorage } from "multer-storage-cloudinary";
  import { v2 as cloudinary } from "cloudinary";
  import dotenv from "dotenv";

  dotenv.config(); // ensure env is loaded

  // Configure Cloudinary correctly
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Configure storage for multer
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "team",                // folder name in Cloudinary
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
  });

  const upload = multer({ storage });

  export default upload;
