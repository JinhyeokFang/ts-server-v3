import { Response } from 'express';
import {
  errorHandling, responseOK, ConflictError, responseOKWithFile, BadRequestError,
} from 'ts-response';
import path from 'path';
import { BaseController, RequestWithoutData } from '../BaseController';
import {
  ILoginRequest, IRegisterRequest, IRefreshRequest, IRemoveRequest, IPatchProfileRequest,
} from './AuthController.interface';
import UserService from '../../services/User/UserService';
import JWT, { ITokenData } from '../../modules/JWT';
import { imageUploader } from '../../modules/fileSave';

export default class AuthController extends BaseController {
  public baseURL = '/auth';

  public constructor() {
    super();
    this.router.post('/login', this.login);
    this.router.post('/register', this.register);
    this.router.delete('/remove', this.remove);
    this.router.post('/refresh', this.refresh);
    this.router.use(JWT.checkAccessTokenMiddleware);
    this.router.get('/profile/image', this.getProfileImage);
    this.router.put('/profile', imageUploader('profile'), this.patchProfile);
  }

  /**
 * @api {get} /auth/login Login
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {String} username 유저 아이디
 * @apiParam {String} password 유저 패스워드
 *
 * @apiSuccess {String} accessToken
 * @apiSuccess {String} refreshToken
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "data": {
 *           "accessToken": "",
 *           "refreshToken": ""
 *        }
 *     }
 *
 * @apiError 404 유저를 찾을 수 없습니다.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "error": "유저를 찾을 수 없습니다."
 *     }
 */
  private async login(req: ILoginRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().loginUser(username, password);

      responseOK(res, {
        data: {
          accessToken: await JWT.sign(true, username),
          refreshToken: await JWT.sign(false, username),
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
      responseOK(res, {});
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async remove(req: IRemoveRequest, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      await UserService.getInstance().removeUser(username, password);
      responseOK(res, {});
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async refresh(req: IRefreshRequest, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    try {
      const tokenData: ITokenData = await JWT.verify(refreshToken);

      if (tokenData.isAccessToken) {
        throw new ConflictError('RefreshToken만 가능합니다.');
      }

      const accessToken: string = await JWT.sign(false, tokenData.username);
      responseOK(res, { data: { accessToken } });
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async getProfileImage(req: RequestWithoutData, res: Response): Promise<void> {
    const { username } = res.locals;

    try {
      const data = await UserService.getInstance().getProfile(username);
      console.dir(data);
      responseOKWithFile(res, path.join(__dirname, `../../../files/${'idk'}`));
    } catch (error) {
      errorHandling(res, error);
    }
  }

  private async patchProfile(req: IPatchProfileRequest, res: Response): Promise<void> {
    const { username } = res.locals;

    try {
      if (req.file === undefined) {
        throw new BadRequestError('프로필 사진을 추가해야합니다.');
      }

      const { filename } = req.file;
      await UserService.getInstance().setProfileImage(username, filename);
      responseOK(res, { });
    } catch (error) {
      errorHandling(res, error);
    }
  }
}
