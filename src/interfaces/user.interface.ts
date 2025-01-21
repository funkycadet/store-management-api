import { Prisma, Role } from "@prisma/client";

export type IUser = Omit<Prisma.$UserPayload['scalars'], ''>;

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

export interface IUpdateUserPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
