import { NextFunction, Response } from 'express';
import { UserService } from '../services';
import { STATUS_CODES } from '../exceptions';
import { ProtectedRequest } from '../types';
import { IUser, Pageable } from '../interfaces';

export default class UserController {
  service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getAll = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      const queryParams = {
        ...req.query,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        orderBy: req.query.orderBy as string[] | 'desc',
      };
      const filter = queryParams as unknown as Pageable<IUser>;

      const users = await this.service.getAllUsers(filter);
      return res.status(STATUS_CODES.OK).json({ status: 'success', data: users });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      const user = await this.service.getUserById(req.user.id);
      return res.status(STATUS_CODES.OK).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      const user = await this.service.getUser({id: req.params.id});

      return res.status(STATUS_CODES.OK).json({ status: 'success', data: user });
    } catch(error) {
      next(error)
    }
  };

  updateUser = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      const user = await this.service.updateUser(req.user.id, req.body);
      return res.status(STATUS_CODES.OK).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      const user = await this.service.deleteUser(req.user.id);
      return res.status(STATUS_CODES.NO_CONTENT).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };
}
