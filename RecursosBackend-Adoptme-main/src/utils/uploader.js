import fs from 'fs';
import path from 'path';
import __dirname from "./index.js";
import multer from 'multer';

const imgRoot = path.join(__dirname, '../public/img');

const ensureDir = (dir) => {
    fs.mkdirSync(dir, { recursive: true });
};

const createStorage = (subfolder) =>
    multer.diskStorage({
        destination(req, file, cb) {
            const dir = path.join(imgRoot, subfolder);
            ensureDir(dir);
            cb(null, dir);
        },
        filename(req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });

export const uploaderPets = multer({ storage: createStorage('pets') });
export const uploaderDocuments = multer({ storage: createStorage('documents') });

export default uploaderPets;
