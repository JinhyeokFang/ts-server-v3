import { Router, Response } from 'express';

import { BaseController } from '../BaseController';
import { JWT, TokenStatus } from '../../utils/JWT';
import {
  LoginRequest, RegisterRequest, ReloginRequest, TokenDataRequest,
} from './AuthController.interface';
import UserService from '../../services/User/UserService';
import { CreateUserResult, LoginUserResult } from '../../services/User/UserService.enum';
import Logger from '../../utils/Logger';

export class AuthController extends BaseController {
  public constructor() {
    super();
    this.router.post('/login', this.login);
    this.router.post('/register', this.register);
    this.router.delete('/remove', this.remove);
    this.router.post('/relogin', this.relogin);
    this.router.post('/tokenCheck', this.tokenData);
  }

  private async login(req: LoginRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().loginUser(username, password);
      super.ResponseSuccess(res, {
        data: {
          accessToken: JWT.createAccessToken({ username }),
          refreshToken: JWT.createRefreshToken({ username }),
        },
      });
    } catch (error) {
      switch (error) {
        case LoginUserResult.NotFound:
          super.ResponseNotFound(res, { errorMessage: 'User Not Found' });
          break;
        default:
          super.ResponseInternalServerError(res, { errorMessage: 'Server Error' });
          Logger.error(error);
          break;
      }
    }
  }

  //TODO: 이미지 프로필 자동 추가 + editUserInformation
  private async register(req: RegisterRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().createUser(username, password);
      super.ResponseSuccess(res, {});
    } catch (error) {
      switch (error) {
        case CreateUserResult.AlreadyExist:
          super.ResponseConflict(res, { errorMessage: 'User Already Exist' });
          break;
        default:
          super.ResponseInternalServerError(res, { errorMessage: 'Server Error' });
          Logger.error(error);
          break;
      }
    }
  }

  private async remove(req: RemoveRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().removeUser(username, password);
      super.ResponseSuccess(res, {});
    } catch (error) {
      switch (error) {
        case RemoveUser.NotFound:
          super.ResponseNotFound(res, { errorMessage: 'User Not Found' });
          break;
        case RemoveUser.PasswordIncorrect:
          super.ResponseForbidden(res, { errorMessage: 'Password Incorrect' });
          break;
        default:
          super.ResponseInternalServerError(res, { errorMessage: 'Server Error' });
          Logger.error(error);
          break;
      }
    }
  }

  private async relogin(req: ReloginRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    const result = JWT.checkRefreshToken(refreshToken);
    if (result.status === TokenStatus.OK) {
      super.ResponseSuccess(res, {
        data: {
          accessToken: JWT.createAccessToken(result.userData ? result.userData : {}),
          refreshToken: JWT.createRefreshToken(result.userData ? result.userData : {}),
        },
      });
    } else if (result.status === TokenStatus.Expired) {
      super.ResponseForbidden(res, { errorMessage: 'Token Is Expired' });
    } else {
      super.ResponseBadRequest(res, { errorMessage: 'Token Is Wrong' });
    }
  }

  private async tokenData(req: TokenDataRequest, res: Response): Promise<void> {
    const { token } = req.body;

    const tokenObject = JWT.decodeToken(token);
    const checkAccessToken = JWT.checkAccessToken(token);
    const checkRefreshToken = JWT.checkRefreshToken(token);
    super.ResponseSuccess(res, {
      data: {
        tokenObject,
        accessTokenOK: checkAccessToken.status === TokenStatus.OK,
        refreshTokenOK: checkRefreshToken.status === TokenStatus.OK,
      },
    });
  }

  public get controllerRouter(): Router {
    return this.router;
  }
}

export default new AuthController().controllerRouter;
