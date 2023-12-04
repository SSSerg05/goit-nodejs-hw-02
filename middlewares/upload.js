import multer from "multer";
import HttpError from "../helpers/HttpError.js";

const destination = path.resolve("tmp");

// storage, limits, fileFilter
const storage = multer.diskStorage({
  destination,
  filename: (req, res,cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`
    const filename = `${uniquePrefix}_${file.originalname}`
    
    cb(null, file.originalname);
  },
})

const limits = {
  fileSize: 5 * 1024 * 1024, //(5MB)
}

const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split('.').pop();
  if (extention === 'exe') {
    cb(HttpError(400, "Invalid file extention"));
  }

  cb(null, true);
}

const upload = multer({
  storage,
  limits,
  fileFilter,
})

export default upload;