import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { BadRequestError } from 'ts-response';

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file,
      cb: (...args: unknown[]) => void): void => cb(null, './files'),
    filename: (req: Request, file,
      cb: (...args: unknown[]) => void): void => cb(null,
      crypto.randomBytes(32).toString('hex') + path.extname(file.originalname)),
  }),
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return cb(new BadRequestError('이미지만 가능합니다.'));
    }
    return cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file,
      cb: (...args: unknown[]) => void): void => cb(null, './files'),
    filename: (req: Request, file,
      cb: (...args: unknown[]) => void): void => cb(null,
      crypto.randomBytes(32).toString('hex') + path.extname(file.originalname)),
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

export { imageUpload, fileUpload };
