// middlewares/attachFileToBody.js
export const attachFileToBody = (fieldName) => {
  return (req, res, next) => {
    if (req.file && req.file.path) {
      req.body[fieldName] = req.file.path; // multer + Cloudinary URL
    }
    next();
  };
};
