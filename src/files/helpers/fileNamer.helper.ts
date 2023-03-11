import { Request } from 'express';
import { v4 as uuid } from 'uuid';

export const fileNamerHelper = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error, acceptFile: string) => void,
) => {
  // Not File
  if (!file) cb(new Error('File is empty'), '');

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtension}`;

  cb(null, fileName);
};
