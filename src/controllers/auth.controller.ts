import { STATUS_CODES } from "../exceptions";
import { AuthService } from "../services";
import { Request, Response, NextFunction } from "express";

export default class AuthController {
  service: AuthService;

  constructor() {
    this.service = new AuthService();
  }
  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const user = await this.service.signup(req.body);
      return res.status(STATUS_CODES.CREATED).json({ status: "success", data: user });
    } catch (error) {
      next(error);
    }
  };

  adminSignup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> => {
    try {
      const user = await this.service.adminSignup(req.body);
      return res.status(STATUS_CODES.CREATED).json({ status: "success", data: user });
    } catch (error) {
      next(error);
    }
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const user = await this.service.login(req.body);

      return res
        .cookie("jwt", user.refreshToken, { httpOnly: true })
        .status(STATUS_CODES.OK)
        .json({
          status: "success",
          data: user.data,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        });
    } catch (error) {
      next(error);
    }
  };

  refreshTokens = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // const { token } = req.body;

      // const accessToken = await this.service.refreshToken(token);
      const refreshToken = req.cookies.jwt;
      const accessToken = await this.service.refreshToken(refreshToken);
      res.json(accessToken);
      // return res
      //   .cookie("jwt", user.refreshToken, { httpOnly: true })
      //   .status(200)
      //   .json({
      //     status: "success",
      //     data: user.data,
      //     accessToken: user.accessToken,
      //     refreshToken: user.refreshToken,
      //   });
    } catch (error) {
      next(error);
    }
  };
}

