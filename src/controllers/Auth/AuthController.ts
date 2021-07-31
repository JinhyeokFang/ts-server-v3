import { Request, Response } from 'express';

import { errorHandling, responseSuccess, ConflictError } from 'ts-response';
import BaseController from '../BaseController';
import {
  ILoginRequest, IRegisterRequest, IReloginRequest, IRemoveRequest,
} from './AuthController.interface';
import UserService from '../../services/User/UserService';
import JWT, { ITokenData } from '../../utils/JWT';

export default class AuthController extends BaseController {
  public constructor() {
    super();
    this.router.post('/login', this.login);
    this.router.post('/register', this.register);
    this.router.delete('/remove', this.remove);
    this.router.post('/refresh', this.refresh);
    this.router.use(JWT.checkAccessTokenMiddleware);
    this.router.get('/profile', this.getProfile);
    this.router.patch('/profile', this.patchProfile);
  }

  private async login(req: ILoginRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().loginUser(username, password);

      responseSuccess(res, {
        data: {
          accessToken: JWT.sign(true, username),
          refreshToken: JWT.sign(false, username),
        },
      });
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async register(req: IRegisterRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().createUser(username, password);
      responseSuccess(res, {});
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async remove(req: IRemoveRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().removeUser(username, password);
      responseSuccess(res, {});
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async refresh(req: IReloginRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    try {
      const tokenData: ITokenData = await JWT.verify(refreshToken);

      if (tokenData.isAccessToken) {
        throw new ConflictError('RefreshToken만 가능합니다.');
      }

      const accessToken: string = await JWT.sign(false, tokenData.username);
      responseSuccess(res, { data: { accessToken } });
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async getProfile(req: Request, res: Response): Promise<void> {
    const { username } = res.locals;

    try {
      const data = await UserService.getInstance().getProfile(username);
      responseSuccess(res, { data });
    } catch (error) {
      errorHandling(res, error);
    }
  }

  // TODO: 이미지 변경
  private async patchProfile(req: Request, res: Response): Promise<void> {
    const { username } = res.locals;

    try {
      responseSuccess(res, {  });
    } catch (error) {
      errorHandling(res, error);
    }
  }
}
