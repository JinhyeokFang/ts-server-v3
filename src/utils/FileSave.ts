import { Request } from 'express';
import multer from 'multer';
import path from 'path';

export default multer({
  storage: multer.diskStorage({
    destination: (req: Request, file,
      cb: (...args: unknown[]) => void): void => cb(null, './files'),
    filename: (req: Request, file,
      cb: (...args: unknown[]) => void): void => cb(null,
      new Date().valueOf() + path.extname(file.originalname)),
  }),
});
