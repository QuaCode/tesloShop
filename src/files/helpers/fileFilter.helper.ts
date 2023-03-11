import { Request } from 'express';

const acceptedImages = ['png', 'svg', 'jpg', 'jpeg', 'gif'];

export const fileFilterHelper = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error, acceptFile: boolean) => void,
) => {
  // Not File
  if (!file) cb(new Error('File is empty'), false);
  // File Type
  if (!acceptedImages.includes(file.mimetype.split('/')[1]))
    cb(new Error('File is not permitted'), false);

  cb(null, true);
};
