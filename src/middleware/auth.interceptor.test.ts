import { NextFunction, Request, Response } from 'express';
import { AuthServices, Payload } from '../services/auth';
import { AuthInterceptor } from './auth.interceptor';
import { UserRepo } from '../repository/user.m.repository';
import { HttpError } from '../types/http.error';
import { SightingRepo } from '../repository/sighting.m.repository';

jest.mock('../services/auth');

describe('Given an interceptor', () => {
  describe('When it is instantiated and logged method is called', () => {
    test('Then next should have been called', () => {
      const next = jest.fn() as NextFunction;
      const mockPayload = {} as Payload;
      const req = { body: { tokenPayload: mockPayload } } as Request;
      const res = {} as Response;
      req.get = jest.fn().mockReturnValueOnce('Bearer valid token');
      const mockRepo: UserRepo = {} as unknown as UserRepo;
      const mockSightingRepo: SightingRepo = {} as unknown as SightingRepo;
      const interceptor = new AuthInterceptor(mockRepo, mockSightingRepo);
      (AuthServices.verifyJWT as jest.Mock).mockResolvedValueOnce(mockPayload);
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When it is instantiated and authorized method is called', () => {
    test('Then next should have been called', () => {
      const next = jest.fn() as NextFunction;
      const mockPayload = { id: '1' } as Payload;
      const req = {
        body: { tokenPayload: mockPayload },
        params: { id: '1' },
      } as unknown as Request;
      const res = {} as Response;
      const mockRepo: UserRepo = {} as unknown as UserRepo;
      const mockSightingRepo: SightingRepo = {} as unknown as SightingRepo;
      const interceptor = new AuthInterceptor(mockRepo, mockSightingRepo);
      interceptor.authorized(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When logged method is called but there is no authHeader', () => {
    test('Then it should throw an error', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Authorization header'
      );
      const next = jest.fn() as NextFunction;
      const mockPayload = {} as Payload;
      const req = { body: { tokenPayload: mockPayload } } as Request;
      const res = {} as Response;
      req.get = jest.fn().mockReturnValueOnce(undefined);
      const mockRepo: UserRepo = {} as unknown as UserRepo;
      const mockSightingRepo: SightingRepo = {} as unknown as SightingRepo;
      const interceptor = new AuthInterceptor(mockRepo, mockSightingRepo);
      (AuthServices.verifyJWT as jest.Mock).mockResolvedValueOnce(mockPayload);
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When logged method is called but the authHeader does not start with Bearer', () => {
    test('Then it should throw an error', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Bearer in Authorization header'
      );
      const next = jest.fn() as NextFunction;
      const mockPayload = {} as Payload;
      const req = { body: { tokenPayload: mockPayload } } as Request;
      const res = {} as Response;
      req.get = jest.fn().mockReturnValueOnce('Not valid token');
      const mockRepo: UserRepo = {} as unknown as UserRepo;
      const mockSightingRepo: SightingRepo = {} as unknown as SightingRepo;
      const interceptor = new AuthInterceptor(mockRepo, mockSightingRepo);
      (AuthServices.verifyJWT as jest.Mock).mockResolvedValueOnce(mockPayload);
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe('When authorized method is called but there is no tokenPayload in the request body', () => {
    test('Then it should throw an error', () => {
      const error = new HttpError(
        498,
        'Token not found',
        'Token not found in Authorized interceptor'
      );
      const next = jest.fn() as NextFunction;
      const req = {
        body: { tokenPayload: undefined },
        params: { id: '1' },
      } as unknown as Request;
      const res = {} as Response;
      const mockRepo: UserRepo = {} as unknown as UserRepo;
      const mockSightingRepo: SightingRepo = {} as unknown as SightingRepo;
      const interceptor = new AuthInterceptor(mockRepo, mockSightingRepo);
      interceptor.authorized(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
