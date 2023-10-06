import http from 'http';
import * as dotenv from 'dotenv';
import { app } from './app.js';
import createDebug from 'debug';
import { dbConnect } from './db/db.connect.js';
const debug = createDebug('Quiet');

dotenv.config();
const PORT = process.env.PORT || 9999;

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('Connected to db:', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    server.emit('error', error);
  });

server.on('listening', () => {
  const addressInfo = server.address();
  if (addressInfo === null) {
    server.emit('error', new Error('Invalid network address'));
    return;
  }

  let bind: string;
  if (typeof addressInfo === 'string') {
    bind = 'pipe ' + addressInfo;
  } else {
    bind =
      addressInfo.address === '::'
        ? `http://localhost:${addressInfo?.port}`
        : `port ${addressInfo?.port}`;
  }

  debug('Listening');
  console.log(`Listening on ${bind}`);
});

server.on('error', (error) => {
  console.log(`Error ${error.message}`);
});
