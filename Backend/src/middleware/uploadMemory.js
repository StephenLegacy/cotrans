import fileUpload from 'express-fileupload';

// configure express-fileupload
const upload = fileUpload({
  useTempFiles: false, // store files in memory buffer
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  abortOnLimit: true,
  createParentPath: true
});

export default upload;
