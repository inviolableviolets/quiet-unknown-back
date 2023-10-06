import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import { userRouter } from './routers/user.router.js';
import { handleError } from './middleware/error.js';
import { sightingRouter } from './routers/sighting.router.js';
const debug = createDebug('Quiet: App');

export const app = express();

debug('Loaded Express App');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.header('Content-Security-Policy', 'upgrade-insecure-requests;');
  next();
});

app.use(express.static('public'));

app.use('/user', userRouter);
app.use('/sighting', sightingRouter);

app.use(handleError);
