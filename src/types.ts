import { IUser } from './interfaces';
import { Request } from 'express';

export type TokenData = {
  id: string;
  role: string
};

export type PublicUserData = Omit<IUser, 'id' | 'password'>;

export interface ProtectedRequest extends Request {
  user: IUser;
}
