import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { postController, userController } from './controllers/index.js';

const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post(
  '/auth/register',
  handleValidationErrors,
  registerValidation,
  userController.register
);
app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  userController.login
);
app.get('/auth/me', checkAuth, userController.getMe);
app.delete('/auth/logout', checkAuth, userController.logout);


// Posts
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.post(
  '/post',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  postController.create
);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch(
  '/post/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  postController.update
);


app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
