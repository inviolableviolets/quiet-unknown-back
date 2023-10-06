import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { SightingRepo } from '../repository/sighting.m.repository.js';
import { SightingController } from '../controllers/sighting.controller.js';
import { UserRepo } from '../repository/user.m.repository.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileMiddleware } from '../middleware/files.js';
const debug = createDebug('Quiet:UserRouter');

debug('Executed');
const sightingRepo: SightingRepo = new SightingRepo();
const userRepo: UserRepo = new UserRepo();
const controller = new SightingController(sightingRepo, userRepo);
export const sightingRouter = createRouter();
const auth = new AuthInterceptor(userRepo, sightingRepo);
const fileStore = new FileMiddleware();

sightingRouter.get('/', controller.getAll.bind(controller));
sightingRouter.get('/:id', controller.getById.bind(controller));
sightingRouter.post(
  '/form',
  auth.logged.bind(auth),
  fileStore.singleFileStore('image').bind(fileStore),
  fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.post.bind(controller)
);
sightingRouter.patch(
  '/:id',
  auth.logged.bind(auth),
  auth.authorized.bind(auth),
  controller.patch.bind(controller)
);
sightingRouter.delete(
  '/:id',
  auth.logged.bind(auth),
  auth.authorized.bind(auth),
  controller.deleteById.bind(controller)
);
