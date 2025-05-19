import multer from 'multer';
import path from 'path';
import fs from 'fs';

class FileUploadService {
  constructor() {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../storage/cvs');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    });

    this.fileFilter = (req, file, cb) => {
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const ext = path.extname(file.originalname).toLowerCase();
      
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
      }
    };

    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
      }
    });
  }

  getUploadMiddleware() {
    console.log("getUploadMiddleware");
    return this.upload.single('cv');
  }

  getFileUrl(filename) {
    return `/storage/cvs/${filename}`;
  }

  deleteFile(filename) {
    const filePath = path.join(__dirname, '../../storage/cvs', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export default new FileUploadService(); 