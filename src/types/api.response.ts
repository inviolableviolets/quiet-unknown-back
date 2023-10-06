import { User } from '../entities/user.js';

export type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  items: { [key: string]: any }[];
};

export type LoginResponse = {
  token: string;
  user: User;
};
