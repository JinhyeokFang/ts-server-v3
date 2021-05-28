// createUser
// getUser
// removeUser
// editUser

import { UserModel } from '../../models/User/UserModel';
import Crypto from '../../utils/Crypto';
import Logger from '../../utils/Logger';

export default class UserService {
  private static instance: UserService;

  /**
   * Service 인스턴스 생성시 로그 작성
   */
  private constructor() {
    Logger.info('UserService Created');
  }

  /**
   * Service는 Singleton 패턴으로 작성
   */
  public static getInstance() {
    if (UserService.instance == null) UserService.instance = new UserService();
    return UserService.instance;
  }

  /**
   * 유저 생성
   * @param  {string} username
   * @param  {string} password
   * @returns  {boolean}
   */
  public async createUser(username: string, password: string): Promise<boolean> {
    try {
      const key: string = await Crypto.createKey();
      const encryptedPassword: string = await Crypto.hash(password, key);
      const iv: Buffer = await Crypto.createIV();
      await UserModel.create({ username, password: encryptedPassword, key, iv });
      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
