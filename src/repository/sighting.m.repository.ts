import { Sighting } from '../entities/sighting.js';
import createDebug from 'debug';
import { SightingModel } from './sighting.m.model.js';
import { HttpError } from '../types/http.error.js';
const debug = createDebug('Quiet:SightingRepo ');

export class SightingRepo {
  constructor() {
    debug('Instantiated', SightingModel);
  }

  async query(page = 1, limit = 4, region?: string): Promise<Sighting[]> {
    page = Number(page as any);
    limit = Number(limit as any);

    const queryObj = {} as any;

    if (region) {
      queryObj.region = region;
    }

    return SightingModel.find(queryObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', { sightings: 0 })
      .exec();
  }

  async count(region?: string): Promise<number> {
    const queryObj = {} as any;

    if (region) {
      queryObj.region = region;
    }

    return SightingModel.countDocuments(queryObj).exec();
  }

  async queryById(id: string): Promise<Sighting> {
    const result = await SightingModel.findById(id)
      .populate('owner', { sightings: 0 })
      .exec();
    if (result === null)
      throw new HttpError(400, 'Not found', 'No user found with this id');
    return result;
  }

  async create(data: Omit<Sighting, 'id'>): Promise<Sighting> {
    const newSighting = await SightingModel.create(data);
    return newSighting;
  }

  async update(id: string, data: Partial<Sighting>): Promise<Sighting> {
    const newSighting = await SightingModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (newSighting === null)
      throw new HttpError(404, 'Not found', 'Invalid id');
    return newSighting;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Sighting[]> {
    const result = await SightingModel.find({ [key]: value }).exec();
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await SightingModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not found', 'Invalid id');
  }
}
