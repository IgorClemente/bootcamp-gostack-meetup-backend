import express from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import AuthMiddleware from './middlewares/auth';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import FileController from './controllers/FileController';
import MeetupController from './controllers/MeetupController';
import ScheduleController from './controllers/ScheduleController';
import SubscribeController from './controllers/SubscribeController';

const routes = express.Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);

routes.put('/users', UserController.update);
routes.post('/uploads', upload.single('file'), FileController.store);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.get('/schedules', ScheduleController.index);
routes.delete('/meetups/:id', MeetupController.delete);
routes.post('/subscribes', SubscribeController.store);

export default routes;
