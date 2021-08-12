// createUser
// getUser
// removeUser
// editUser

import { NotFoundError, ConflictError, BadRequestError } from 'ts-response';
import validator from 'validator';
import { IUser, UserModel } from '../../db/models/User/UserModel';
import Crypto from '../../modules/Crypto';
import logger from '../../modules/logger';

export default class UserService {
  private static instance: UserService;

  /**
   * Service 인스턴스 생성시 로그 작성
   */
  private constructor() {
    logger.info('UserService Created');
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
   * @returns  {void}
   */
  public async createUser(username: string, password: string): Promise<void> {
    // 이미 존재하는 유저인지 확인
    const userInstance = await UserModel.findOne({
      username,
    });
    if (userInstance) {
      throw new ConflictError('이미 존재하는 유저입니다.');
    }
    if (!validator.isEmail(username)) {
      throw new BadRequestError('username은 이메일만 가능합니다.');
    }
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })) {
      throw new BadRequestError('잘못된 비밀번호입니다.');
    }

    const key: string = await Crypto.createKey();
    const encryptedPassword: string = await Crypto.hash(password, key);
    const iv: Buffer = await Crypto.createIV();
    await UserModel.create({
      username, password: encryptedPassword, key, iv, profileImageURL: 'default_profile.jpg',
    });
  }

  /**
   * 유저 로그인
   * @param  {string} username
   * @param  {string} password
   * @returns  {void}
   */
  public async loginUser(username: string, password: string): Promise<void> {
    // 이미 존재하는 유저인지 확인
    const userInstance = await UserModel.findOne({
      username,
    });
    if (!userInstance) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }

    // 입력한 비밀번호 해시화 후 비교
    const encryptedPassword: string = await Crypto.hash(password, userInstance.key);
    if (encryptedPassword !== userInstance.password) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }
  }

  /**
   * 유저 삭제
   * @param  {string} username
   * @param  {string} password
   * @returns  {void}
   */
  public async removeUser(username: string, password: string): Promise<void> {
    // 이미 존재하는 유저인지 확인
    const userInstance = await UserModel.findOne({
      username,
    });
    if (!userInstance) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }

    // 입력한 비밀번호 해시화 후 비교
    const encryptedPassword: string = await Crypto.hash(password, userInstance.key);
    if (encryptedPassword !== userInstance.password) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }

    // 삭제
    userInstance.remove();
  }

  /**
   * 유저 프로필 불러오기
   * @param  {string} username
   * @param  {string} password
   * @returns  {IUser}
   */
  public async getProfile(username: string): Promise<IUser> {
    // 이미 존재하는 유저인지 확인
    const userInstance = await UserModel.findOne({
      username,
    });
    if (!userInstance) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }

    return userInstance;
  }

  /**
   * 유저 프로필 불러오기
   * @param  {string} username
   * @param  {string} password
   * @returns  {void}
   */
  public async setProfileImage(username: string, filename: string): Promise<void> {
    // 이미 존재하는 유저인지 확인
    const userInstance = await UserModel.findOne({
      username,
    });
    if (!userInstance) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }
    await UserModel.updateOne({ username }, { $set: { profileImageURL: filename } });
  }
}
