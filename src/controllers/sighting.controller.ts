import { NextFunction, Request, Response } from 'express';
import { SightingRepo } from '../repository/sighting.m.repository.js';
import { UserRepo } from '../repository/user.m.repository.js';
import { Controller } from './controller.js';
import { Sighting } from '../entities/sighting.js';
import createDebug from 'debug';
import { Payload } from '../services/auth.js';
import { ApiResponse } from '../types/api.response.js';
const debug = createDebug('Quiet:SightingController');

export class SightingController extends Controller<Sighting> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: SightingRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as Payload;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newSighting = await this.repo.create(req.body);
      user.submissions.push(newSighting);
      this.userRepo.update(user.id, user);
      res.status(201);
      res.send(newSighting);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page as string) || 1;
      const limit = 4;
      const region = req.query.region as string;

      let items: Sighting[] = [];
      let next = null;
      let previous = null;
      let baseUrl = '';

      if (region) {
        items = await this.repo.query(page, limit, region);
        const totalCount = await this.repo.count(region);
        const totalPages = Math.ceil(totalCount / limit);

        baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

        if (page < totalPages) {
          next = `${baseUrl}?region=${region}&page=${page + 1}`;
        }

        if (page > 1) {
          previous = `${baseUrl}?region=${region}&page=${page - 1}`;
        }

        const response: ApiResponse = {
          items,
          count: await this.repo.count(region),
          previous,
          next,
        };
        res.send(response);
      } else {
        items = await this.repo.query(page, limit);
        const totalCount = await this.repo.count();

        const totalPages = Math.ceil(totalCount / limit);

        baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;

        if (page < totalPages) {
          next = `${baseUrl}?page=${page + 1}`;
        }

        if (page > 1) {
          previous = `${baseUrl}?page=${page - 1}`;
        }

        const response: ApiResponse = {
          items,
          count: await this.repo.count(),
          previous,
          next,
        };
        res.send(response);
      }
    } catch (error) {
      next(error);
    }
  }
}
