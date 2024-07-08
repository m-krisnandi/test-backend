import multer from "multer";
import { v7 as uuidv7 } from 'uuid';
import path from 'path'
import { BadRequestError } from "../errors";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv7();
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new BadRequestError('Not an image! Please upload an image.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // max size 5MB
});

export default upload;