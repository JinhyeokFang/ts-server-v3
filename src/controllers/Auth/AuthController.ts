import { Response } from 'express';

import { errorHandling, responseSuccess, ConflictError } from 'ts-response';
import BaseController from '../BaseController';
import {
  LoginRequest, RegisterRequest, ReloginRequest, RemoveRequest,
} from './AuthController.interface';
import UserService from '../../services/User/UserService';
import JWT, { TokenData } from '../../utils/JWT';

export default class AuthController extends BaseController {
  public constructor() {
    super();
    this.router.post('/login', this.login);
    this.router.post('/register', this.register);
    this.router.delete('/remove', this.remove);
    this.router.post('/refresh', this.refresh);
  }

  private async login(req: LoginRequest, res: Response): Promise<void> {
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

  // TODO: 이미지 프로필 자동 추가 + editUserInformation
  private async register(req: RegisterRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().createUser(username, password);
      responseSuccess(res, {});
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async remove(req: RemoveRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().removeUser(username, password);
      responseSuccess(res, {});
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async refresh(req: ReloginRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    try {
      const tokenData: TokenData = await JWT.verify(refreshToken);

      if (tokenData.isAccessToken) {
        throw new ConflictError('RefreshToken만 가능합니다.');
      }

      const accessToken: string = await JWT.sign(false, tokenData.username);
      responseSuccess(res, { data: { accessToken } });
    } catch (error) {
      errorHandling(res, error);
    }
  }
}
