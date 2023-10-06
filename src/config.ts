import * as dotenv from 'dotenv';

dotenv.config();

export const user = process.env.DB_USER;
export const password = process.env.DB_PASSWORD;
export const db = process.env.DB_NAME;
export const secret = process.env.JWT_SECRET;
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'quiet-unknown.firebaseapp.com',
  projectId: 'quiet-unknown',
  storageBucket: 'quiet-unknown.appspot.com',
  messagingSenderId: '990209791454',
  appId: '1:990209791454:web:75c0497f1771e88036394f',
};
