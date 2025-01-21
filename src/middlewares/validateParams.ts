import { Request, Response, NextFunction } from "express";
import { ProtectedRequest } from "../types";
import Joi from 'joi';
import { BadRequestError } from '../exceptions';

const validatePagination = (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    // Silently correct negative values
    if (page !== undefined) {
      req.query.page = Math.max(1, page).toString();
    }

    if (limit !== undefined) {
      req.query.limit = Math.max(1, limit).toString();
    }

    next();
  } catch (error) {
    next(error);
  }
};

const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      next(new BadRequestError(`Invalid parameters: ${error.message}`));
    } else {
      next();
    }
  };
};

export default validateParams;
