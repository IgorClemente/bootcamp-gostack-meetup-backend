import express from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import AuthMiddleware from './middlewares/auth';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import FileController from './controllers/FileController';

const routes = express.Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);

routes.put('/users', UserController.update);
routes.post('/uploads', upload.single('file'), FileController.store);

export default routes;
