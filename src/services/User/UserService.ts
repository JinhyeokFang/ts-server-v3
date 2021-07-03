// createUser
// getUser
// removeUser
// editUser

import { UserModel } from '../../models/User/UserModel';
import Crypto from '../../utils/Crypto';
import Logger from '../../utils/Logger';
import { CreateUserResult, LoginUserResult } from './UserService.enum';

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
  public static getInstance(): UserService {
    if (UserService.instance == null) UserService.instance = new UserService();
    return UserService.instance;
  }

  /**
   * 유저 생성
   * @param  {string} username
   * @param  {string} password
   * @returns  {CreateUserResult}
   */
  public async createUser(username: string, password: string): Promise<CreateUserResult> {
    // 이미 존재하는 유저인지 확인
    const userInstance = await UserModel.findOne({
      username,
    });
    if (userInstance) {
      throw CreateUserResult.AlreadyExist;
    }

    const key: string = await Crypto.createKey();
    const encryptedPassword: string = await Crypto.hash(password, key);
    const iv: Buffer = await Crypto.createIV();
    await UserModel.create({
      username, password: encryptedPassword, key, iv,
    });

    return CreateUserResult.Success;
  }

  /**
   * 유저 로그인
   * @param  {string} username
   * @param  {string} password
   * @returns  {LoginUserResult}
   */
  public async loginUser(username: string, password: string): Promise<LoginUserResult> {
    // 이미 존재하는 유저인지 확인
    const userInstance = await UserModel.findOne({
      username,
    });
    if (!userInstance) {
      throw LoginUserResult.NotFound;
    }

    // 입력한 비밀번호 해시화 후 비교
    const encryptedPassword: string = await Crypto.hash(password, userInstance.key);
    if (encryptedPassword !== userInstance.password) {
      throw LoginUserResult.NotFound;
    }
    return LoginUserResult.Success;
  }

  /**
   * 유저 삭제
   * @param  {string} username
   * @param  {string} password
   * @returns  {RemoveUserResult}
   */
  public async RemoveUser(username: string, password: string): Promise<RemoveUserResult> {
    // 이미 존재하는 유저인지 확인
    const userInstance = await UserModel.findOne({
      username,
    });
    if (!userInstance) {
      throw LoginUserResult.NotFound;
    }

    // 입력한 비밀번호 해시화 후 비교
    const encryptedPassword: string = await Crypto.hash(password, userInstance.key);
    if (encryptedPassword !== userInstance.password) {
      throw LoginUserResult.PasswordIncorrect;
    }

    // 삭제
    userInstance.remove();
    return LoginUserResult.Success;
  }
}
