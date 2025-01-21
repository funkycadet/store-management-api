import * as argon from 'argon2';
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from '../config';
import { db } from '../database';
import UserService from './user.service';
import { IUser, IUserLogin, IUserSignup } from '../interfaces';
import { signJWT, verifyJWT } from '../utils';
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '../exceptions';
import { PublicUserData } from '../types';

export default class AuthService {
  user: UserService;

  constructor() {
    this.user = new UserService();
  }

  private signToken(resource: IUser): {
    refreshToken: string;
    accessToken: string;
  } {
    const dataToSign = {
      id: resource.id,
      role: resource.role
    };

    const accessToken = signJWT(
      dataToSign,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY,
    );
    const refreshToken = signJWT(
      dataToSign,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY,
    );

    return { accessToken, refreshToken };
  }

  public async signup(data: IUserSignup): Promise<{accessToken: string, refreshToken: string}> {
    const existingUser = await this.user.getUser({ emailAddress: data.emailAddress });
    if (existingUser) throw new ForbiddenError(`User exists with provided email!`);

    const hashedPassword = await argon.hash(data.password);

    const user = await this.user.createUser({...data, password: hashedPassword});
    const { accessToken, refreshToken } = this.signToken(user);
    return { accessToken, refreshToken };
  }

  public async adminSignup(data: IUserSignup): Promise<{accessToken: string, refreshToken: string}> {
    const existingUser = await this.user.getUser({ emailAddress: data.emailAddress });
    if (existingUser) throw new ForbiddenError(`User exists with provided email!`);

    const hashedPassword = await argon.hash(data.password);

    const user = await this.user.createUser({...data, password: hashedPassword, role: 'admin'});
    const { accessToken, refreshToken } = this.signToken(user);
    return { accessToken, refreshToken };
  }

  public async login(loginData: IUserLogin): Promise<{
    data: PublicUserData;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await db.user.findUnique({
      where: {
        emailAddress: loginData.emailAddress,
      },
    });

    if (!user || !(await argon.verify(user.password, loginData.password))) {
      throw new UnauthorizedError(`Incorrect email or password!`);
    }
    const { refreshToken, accessToken } = this.signToken(user);
    return { data: user, accessToken, refreshToken };
  }

  public async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    if (!refreshToken) throw new UnauthorizedError(`No token provided`);

    const token: any = verifyJWT(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await this.user.getUser({
      id: token.id,

    });

    if (!user) throw new NotFoundError(`No user found`);

    const accessToken = signJWT(
      {
        id: user.id,
        role: user.role
      },
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY,
    );
    return { accessToken };
  }
}

