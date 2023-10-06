import { Schema, model } from 'mongoose';
import { Sighting } from '../entities/sighting.js';

const sightingSchema = new Schema<Sighting>({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: {
      urlOriginal: String,
      url: String,
      mimetype: String,
      size: Number,
    },
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

sightingSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const SightingModel = model('Sighting', sightingSchema, 'sightings');
