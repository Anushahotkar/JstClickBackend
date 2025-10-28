import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    public_id: (req, file) => Date.now() + "-" + file.originalname.split(".")[0],
  },
  
});

const upload = multer({ storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
 });

export default upload;
