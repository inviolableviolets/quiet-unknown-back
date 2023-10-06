import { NextFunction, Request, Response } from 'express';
import { SightingRepo } from '../repository/sighting.m.repository';
import { SightingController } from './sighting.controller';
import { UserRepo } from '../repository/user.m.repository';
import { User } from '../entities/user';
import { Sighting } from '../entities/sighting';

let mockRepo: SightingRepo;
let mockRepoUser: UserRepo;
let req: Request;
let res: Response;
let next: NextFunction;

describe('Given an abstract Controller class', () => {
  mockRepoUser = {
    queryById: jest.fn(),
    update: jest.fn(),
  } as unknown as UserRepo;
  mockRepo = {
    query: jest.fn(),
    queryById: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  } as unknown as SightingRepo;

  req = {
    query: {},
    body: {},
    params: {},
    protocol: 'http',
    get: jest.fn().mockReturnValue('localhost:7777'),
    baseUrl: '/sighting',
  } as unknown as Request;

  res = {
    send: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  next = jest.fn() as NextFunction;

  describe('When its extended by SightingController', () => {
    test('Then method query should be used', async () => {
      const controller = new SightingController(mockRepo, mockRepoUser);
      req.query = { page: '1' };
      await controller.getAll(req, res, next);
      expect(mockRepo.query).toHaveBeenCalledWith(1, 4);
      expect(mockRepo.count).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });

    test('Then method query should be called with region', async () => {
      const controller = new SightingController(mockRepo, mockRepoUser);
      req.query = { page: '2', region: 'Africa' };

      await controller.getAll(req, res, next);
      expect(mockRepo.query).toHaveBeenCalledWith(2, 4, 'Africa');
      expect(mockRepo.count).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });

    test('Then it should calculate the next page URL if there are more pages', async () => {
      const controller = new SightingController(mockRepo, mockRepoUser);
      req.query = { page: '1' };

      mockRepo.count = jest.fn().mockResolvedValue(8);
      mockRepo.query = jest.fn().mockResolvedValue([{}, {}, {}, {}]);

      await controller.getAll(req, res, next);

      expect(mockRepo.query).toHaveBeenCalledWith(1, 4);
      expect(mockRepo.count).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalled();
    });

    test('Then it should calculate the next page URL if there are more pages', async () => {
      const controller = new SightingController(mockRepo, mockRepoUser);
      const region = 'Africa';
      req.query = { page: '1', region };

      mockRepo.count = jest.fn().mockResolvedValue(5);
      mockRepo.query = jest.fn().mockResolvedValue([{}, {}, {}, {}]);

      await controller.getAll(req, res, next);

      expect(mockRepo.query).toHaveBeenCalledWith(1, 4, region);
      expect(mockRepo.count).toHaveBeenCalledWith(region);
      expect(res.send).toHaveBeenCalled();
    });

    test('Then method getById method should be used', async () => {
      const controller = new SightingController(mockRepo, mockRepoUser);
      await controller.getById(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.queryById).toHaveBeenCalled();
    });

    test('Then the method post should be called', async () => {
      const controller = new SightingController(mockRepo, mockRepoUser);
      const mockUser = {
        id: '5',
        userName: 'Sergio',
        submissions: [],
      } as unknown as User;

      const mockSighting = {
        id: '3',
        title: 'Big Ovnis',
        owner: '5',
      } as unknown as Sighting;

      mockRepo.create = jest.fn().mockResolvedValueOnce(mockSighting);
      mockRepoUser.queryById = jest.fn().mockResolvedValueOnce(mockUser);
      mockRepoUser.update = jest.fn().mockResolvedValueOnce(mockUser);

      req.body = {
        tokenPayload: { id: '5' },
        title: 'Big Ovnis',
        owner: '',
      };

      await controller.post(req, res, next);

      expect(mockRepo.create).toHaveBeenCalledWith(req.body);
      expect(mockRepoUser.queryById).toHaveBeenCalledWith('5');
      expect(mockRepoUser.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockSighting);
    });

    test('Then method patch should be used', async () => {
      const controller = new SightingController(mockRepo, mockRepoUser);
      await controller.patch(req, res, next);
      expect(res.status).toHaveBeenCalledWith(202);
      expect(mockRepo.update).toHaveBeenCalled();
    });

    test('Then method delete should be used', async () => {
      const controller = new SightingController(mockRepo, mockRepoUser);
      await controller.deleteById(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.delete).toHaveBeenCalled();
    });

    describe('Error handlers', () => {
      const error = new Error('error');
      const mockRepoUser = {} as unknown as UserRepo;
      const mockRepo: SightingRepo = {
        query: jest.fn().mockRejectedValue(error),
        queryById: jest.fn().mockRejectedValue(error),
        create: jest.fn().mockRejectedValue(error),
        update: jest.fn().mockRejectedValue(error),
        delete: jest.fn().mockRejectedValue(error),
      } as unknown as SightingRepo;

      const req = {
        params: { id: 1 },
        body: { name: 'thing1', id: 2 },
        query: { offset: '22222' },
      } as unknown as Request;

      const res = {
        send: jest.fn(),
      } as unknown as Response;

      const next = jest.fn() as NextFunction;
      const controller = new SightingController(mockRepo, mockRepoUser);

      test('getAll should handle errors', async () => {
        await controller.getAll(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
      });

      test('getById should handle errors', async () => {
        await controller.getById(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
      });

      test('post should handle errors', async () => {
        await controller.post(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
      });

      test('patch should handle errors', async () => {
        await controller.patch(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
      });

      test('deleteById should handle errors', async () => {
        await controller.deleteById(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });
});
