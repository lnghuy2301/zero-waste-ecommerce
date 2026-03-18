import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerStorage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const randomName = uuidv4();
    callback(null, `${randomName}${extname(file.originalname)}`);
  },
});

export const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|mov|avi)$/i)) {
    return callback(
      new HttpException(
        'Chỉ hỗ trợ file ảnh (JPG, JPEG, PNG, GIF) và video (MP4, MOV, AVI)!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};
