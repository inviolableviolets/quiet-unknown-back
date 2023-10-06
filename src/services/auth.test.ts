import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { AuthServices, Payload } from './auth';
import { HttpError } from '../types/http.error';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Given an static AuthServices class', () => {
  describe('When method createJWT is called', () => {
    const mockPayload = {} as Payload;
    test('Then sign function should have been called', () => {
      AuthServices.createJWT(mockPayload);
      expect(jsonwebtoken.sign).toHaveBeenCalled();
    });
  });
  describe('When method verifyJWT is called', () => {
    const mockTocken = 'test';
    test('Then verify function should have been called', () => {
      AuthServices.verifyJWT(mockTocken);
      expect(jsonwebtoken.verify).toHaveBeenCalled();
    });
  });
  describe('When method AuthServices.hash is called', () => {
    const mockValue = 'Test';
    test('Then hash should have been called', () => {
      AuthServices.hash(mockValue);
      expect(bcryptjs.hash).toHaveBeenCalled();
    });
  });
  describe('When method AuthServices.compare is called', () => {
    const mockValue = 'Test';
    const mockHash = 'Test';
    test('Then it compare should have been called', () => {
      AuthServices.compare(mockValue, mockHash);
      expect(bcryptjs.compare).toHaveBeenCalled();
    });
  });
  describe('When method verifyJWT is called and the type of result is a string', () => {
    test('Then it should throw an error', () => {
      const mockToken = 'test';
      const error = new HttpError(498, 'Invalid Token', 'string');
      (jsonwebtoken.verify as jest.Mock).mockReturnValueOnce('string');
      expect(jsonwebtoken.verify).toHaveBeenCalled();
      expect(() => AuthServices.verifyJWT(mockToken)).toThrow(error);
    });
  });
});
