import { Prisma } from "@prisma/client";
import { db } from "../database";
import { IUpdateUserPassword, IUser, IUserSignup, Pageable } from "../interfaces";
import { BadRequestError, NotFoundError } from "../exceptions";
import { PublicUserData } from "../types";
import { pageableHandler } from "../utils";
import * as argon from 'argon2';

export default class UserService {
  public async getAllUsers(filter: Pageable<IUser>): Promise<PublicUserData[]> {
    const query = pageableHandler.process<IUser>(filter);
    const where = query.filter;

    const [users, count] = await Promise.all([
      db.user.findMany({
        skip: query.skip,
        take: query.limit,
        where,
        orderBy: query.orderBy,
        // orderBy: { createdAt: 'desc' },
      }),
      db.user.count({
        where
      }),
    ]);

    return pageableHandler.responseToPageable(query, count, users);
  }

  public async getUserById(id: string): Promise<PublicUserData> {
    try {
      const user = await db.user.findUnique({
        where: {id},
      });

      if (!user) {
        throw new NotFoundError(`User not found!`);
      }
      return user;
    } catch(error) {
        throw new BadRequestError(`Error fetching user: ${error.message}`);
    }
  }

  public async getUser(filter: Partial<Prisma.UserWhereUniqueInput>): Promise<IUser> {
    return await db.user.findFirst({
      where: filter,
    });
  }

  public async createUser(data: IUserSignup): Promise<IUser> {
    return await db.user.create({
      data,
    });
  }

  public async updateUser(id: string, data: object): Promise<IUser> {
    try {
      const user = await db.user.findUnique({
        where: {id},
      });

      if (!user) {
        throw new NotFoundError(`User not found!`);
      }
      return await db.user.update({
        where: {
          id,
        },
        data,
      });
    } catch(error) {
      throw new BadRequestError(`Error updating user: ${error.message}`);
    }
  }

  public async updateUserPassword(
    id: string,
    data: IUpdateUserPassword,
  ): Promise<string> {
    const user = await db.user.findUnique({
      where: {id},
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await argon.verify(user.password, data.currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect!');
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestError(
        'Passwords do not match!',
      );
    }

    const hashedPassword = await argon.hash(data.newPassword);

    await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return 'Password updated successfully';
  }

  public async deleteUser(id: string): Promise<IUser> {
    try {
      const user = await db.user.findUnique({
        where: {id},
      });

      if (!user) {
        throw new NotFoundError(`User not found!`);
      }
      return await db.user.delete({
        where: {
          id,
        },
      });
  } catch(error) {
      throw new BadRequestError(`Error deleting user: ${error.message}`);
    }
  }
}
