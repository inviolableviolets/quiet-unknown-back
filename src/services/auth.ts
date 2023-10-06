import jsonwebtoken from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { secret } from '../config.js';
import { HttpError } from '../types/http.error.js';
const { sign, verify } = jsonwebtoken;
const { hash, compare } = bcryptjs;

export type Payload = JwtPayload & {
  id: string;
  userName: string;
};

export class AuthServices {
  private static salt = 10;

  static createJWT(payload: Payload) {
    return sign(payload, secret!);
  }

  static verifyJWT(token: string) {
    try {
      const result = verify(token, secret!);
      if (typeof result === 'string') {
        throw new HttpError(498, 'Invalid Token', result);
      }

      return result as Payload;
    } catch (error) {
      throw new HttpError(498, 'Invalid Token', (error as Error).message);
    }
  }

  static hash(value: string) {
    return hash(value, AuthServices.salt);
  }

  static compare(value: string, hash: string) {
    return compare(value, hash);
  }
}
