import { Response, NextFunction, RequestHandler } from 'express';
import { ProtectedRequest } from '../types';
import { ForbiddenError } from '../exceptions';

/**
 * Middleware to check if the user has one of the required roles
 * @param roles Array of roles that are allowed to access the route
 */
export default function (role: string[]): RequestHandler {
  return (req: ProtectedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.role) {
        throw new ForbiddenError(`No role found for the user!`);
      }

      const hasRole = role.includes(req.user.role);

      if (!hasRole) {
        throw new ForbiddenError(
          `You do not have permission to access this resource!`,
        );
      }

      next();
    } catch (err: any) {
      next(err);
    }
  };
}
