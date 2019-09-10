import express from 'express';

import AuthMiddleware from './middlewares/auth';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';

const routes = express.Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);

routes.put('/users', UserController.update);

export default routes;
