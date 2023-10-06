import { Sighting } from '../entities/sighting.js';
import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.js';
import { SightingModel } from './sighting.m.model.js';
import { SightingRepo } from './sighting.m.repository.js';
import { Image } from '../types/image.js';

jest.mock('./sighting.m.model');

describe('Given the SightingRepo class', () => {
  const repo = new SightingRepo();
  describe('When it has been instantiated', () => {
    test('Then the query method should be used', async () => {
      const mockData = [{}] as unknown as Sighting[];
      const exec = jest.fn().mockResolvedValueOnce(mockData);

      SightingModel.find = jest.fn().mockReturnValueOnce({
        skip: jest.fn().mockReturnValueOnce({
          limit: jest.fn().mockReturnValueOnce({
            populate: jest.fn().mockReturnValueOnce({
              exec,
            }),
          }),
        }),
      });

      const result = await repo.query();
      expect(SightingModel.find).toHaveBeenCalled();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then the queryById method should be used', async () => {
      const mockSample = { id: '1' };
      const exec = jest.fn().mockResolvedValue(mockSample);
      SightingModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      const result = await repo.queryById('1');
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockSample);
    });

    test('Then the create method should be used', async () => {
      const mockSighting = {
        title: 'test',
        year: 1234,
        region: 'Asia',
        description: 'qwertyuiop',
        image: {} as Image,
        owner: {} as User,
      } as unknown as Sighting;

      SightingModel.create = jest.fn().mockReturnValueOnce(mockSighting);
      const result = await repo.create(mockSighting);
      expect(SightingModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockSighting);
    });

    test('Then the update method should be used', async () => {
      const mockId = '1';
      const mockSighting = { id: '1', title: 'test' };
      const updatedSighting = { id: '1', title: 'test2' };
      const exec = jest.fn().mockResolvedValueOnce(updatedSighting);
      SightingModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.update(mockId, mockSighting);
      expect(SightingModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedSighting);
    });

    test('Then the search method should be used', async () => {
      const mockSightings = [{ id: '1', title: 'test' }];

      const exec = jest.fn().mockResolvedValueOnce(mockSightings);
      SightingModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.search({ key: 'title', value: 'test' });
      expect(SightingModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockSightings);
    });

    test('Then the delete method should be used', async () => {
      const mockId = '1';
      const exec = jest.fn();
      SightingModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await repo.delete(mockId);
      expect(SightingModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then the count method should be used', async () => {
      const mockRegion = 'America';

      const queryObj = {} as any;
      const exec = jest.fn().mockResolvedValueOnce(3);

      SightingModel.countDocuments = jest.fn().mockReturnValue(queryObj);
      queryObj.exec = exec;

      const result = await repo.count(mockRegion);

      expect(exec).toHaveBeenCalled();
      expect(result).toBe(3);
    });
  });

  describe('When it is instantiated and queryById method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new SightingRepo();
      const error = new HttpError(
        404,
        'Not found',
        'No user found with this id'
      );
      const mockId = '1';

      const exec = jest.fn().mockResolvedValue(null);

      SightingModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          exec,
        }),
      });

      await expect(repo.queryById(mockId)).rejects.toThrowError(error);
      expect(SightingModel.findById).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and update method is called but the new user equals to null', () => {
    test('Then it should throw an error', async () => {
      const repo = new SightingRepo();
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const mockSighting = {} as Partial<Sighting>;

      const exec = jest.fn().mockResolvedValue(null);
      SightingModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(repo.update(mockId, mockSighting)).rejects.toThrowError(
        error
      );
      expect(SightingModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and delete method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const repo = new SightingRepo();
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const exec = jest.fn().mockResolvedValueOnce(null);
      SightingModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.delete(mockId)).rejects.toThrowError(error);
      expect(SightingModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When the query method is used', () => {
    test('Then it should return all the films with "Drama" genre', async () => {
      const mockRegion = 'Africa';

      const queryObj = {} as any;
      const skip = jest.fn().mockReturnThis();
      const limit = jest.fn().mockReturnThis();
      const populate = jest.fn().mockReturnThis();
      const exec = jest.fn().mockResolvedValueOnce([]);

      SightingModel.find = jest.fn().mockReturnValue(queryObj);
      queryObj.skip = skip;
      queryObj.limit = limit;
      queryObj.populate = populate;
      queryObj.exec = exec;

      await repo.query(1, 6, mockRegion);

      expect(skip).toHaveBeenCalled();
      expect(limit).toHaveBeenCalled();
      expect(populate).toHaveBeenCalledWith('owner', { sightings: 0 });
      expect(exec).toHaveBeenCalled();
    });
  });
});
