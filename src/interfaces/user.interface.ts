import { Prisma, Role } from "@prisma/client";

export type IUser = Prisma.$UserPayload['scalars']

export interface IUserSignup {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  phoneNumber?: string;
  gender: string;
  role?: Role;
}

export interface IUserLogin {
  emailAddress: string;
  password: string;
}
