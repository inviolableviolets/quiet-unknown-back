import mongoose from 'mongoose';
import { db, password, user } from '../config.js';

export const dbConnect = (env?: string) => {
  const testEnv = env || process.env.NODE_ENV;
  const testDBName = testEnv === 'test' ? db + '_Testing' : db;

  const uri = `mongodb+srv://${user}:${password}@ufo.em4x6vu.mongodb.net/${testDBName}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
