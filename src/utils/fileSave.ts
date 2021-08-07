import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { BadRequestError, responseBadRequest, responseInternalServerError } from 'ts-response';

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

export function imageUploader(imageField: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    imageUpload.single(imageField)(req, res, (error) => {
      if (error instanceof BadRequestError) {
        responseBadRequest(res, { errorMessage: error.message });
      } else if (error) {
        responseInternalServerError(res, { errorMessage: error.message });
      } else {
        next();
      }
    });
  };
}

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

export function fileUploader(fileField: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fileUpload.single(fileField)(req, res, (error) => {
      if (error) {
        responseInternalServerError(res, { errorMessage: error.message });
      } else {
        next();
      }
    });
  };
}
