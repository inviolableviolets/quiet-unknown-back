import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { UserRepo } from '../repository/user.m.repository.js';
import { UserController } from '../controllers/user.controller.js';
const debug = createDebug('Quiet:UserRouter ');

debug('Executed');
const repo = new UserRepo();
const controller = new UserController(repo);
export const userRouter = createRouter();

userRouter.get('/', controller.getAll.bind(controller));
userRouter.get('/:id', controller.getById.bind(controller));
userRouter.post('/register', controller.register.bind(controller));
userRouter.patch('/login', controller.login.bind(controller));
