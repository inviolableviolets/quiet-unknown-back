import { Image } from '../types/image';
import { User } from './user';

export type Sighting = {
  id: string;
  title: string;
  year: number;
  region: 'Asia' | 'America' | 'Oceania' | 'Africa' | 'Europe';
  description: string;
  image: Image;
  owner: User;
};
