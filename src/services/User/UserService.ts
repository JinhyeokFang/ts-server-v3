import { NotFoundError, ConflictError, BadRequestError } from 'ts-response';
import validator from 'validator';
import { getClient } from '../../db';
import Bcrypt from '../../modules/Bcrypt';
import logger from '../../modules/logger';
import { UserPasswords, UserProfile } from './UserService.interface';

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
  public async createUser(email: string, password: string): Promise<void> {
    // 이미 존재하는 유저인지 확인
    const prismaClient = getClient();
    const userInstance: Record<string, unknown> | null = await prismaClient.user.findFirst({
      where: {
        email,
      },
      select: {
        email: true,
      },
    });
    if (userInstance !== null) {
      throw new ConflictError('유저가 이미 존재합니다.');
    }
    if (!validator.isEmail(email)) {
      throw new BadRequestError('username은 이메일만 가능합니다.');
    }
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
    ) {
      throw new BadRequestError('잘못된 비밀번호입니다.');
    }

    const key: string = await Bcrypt.createKey();
    const encryptedPassword: string = await Bcrypt.hash(password, key);
    await prismaClient.user.create({
      data: {
        email,
        password: encryptedPassword,
        profileImageURL: 'default_profile.jpg',
      },
    });
  }

  /**
   * 유저 로그인
   * @param  {string} email
   * @param  {string} password
   * @returns  {void}
   */
  public async loginUser(email: string, password: string): Promise<void> {
    // 이미 존재하는 유저인지 확인
    const prismaClient = getClient();
    const userInstance: UserPasswords | null = await prismaClient.user.findFirst({
      where: {
        email,
      },
      select: {
        password: true,
      },
    });
    if (userInstance === null) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }

    const checkPassword: boolean = await Bcrypt.compare(password, userInstance.password);
    if (!checkPassword) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }
  }

  /**
   * 유저 삭제
   * @param  {string} email
   * @param  {string} password
   * @returns  {void}
   */
  public async removeUser(email: string, password: string): Promise<void> {
    // 이미 존재하는 유저인지 확인
    const prismaClient = getClient();
    const userInstance: UserPasswords | null = await prismaClient.user.findFirst({
      where: {
        email,
      },
      select: {
        password: true,
      },
    });
    if (userInstance === null) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }

    const checkPassword: boolean = await Bcrypt.compare(password, userInstance.password);
    if (!checkPassword) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }

    await prismaClient.user.delete({
      where: {
        email,
      },
    });
  }

  /**
   * 유저 프로필 불러오기
   * @param  {string} email
   * @param  {string} password
   * @return {Profile}
   */
  public async getProfile(email: string): Promise<UserProfile> {
    // 이미 존재하는 유저인지 확인
    const prismaClient = getClient();
    const userInstance: UserProfile | null = await prismaClient.user.findFirst({
      where: {
        email,
      },
      select: {
        email: true,
        profileImageURL: true,
      },
    });
    if (userInstance === null) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }

    return userInstance;
  }

  /**
   * 유저 프로필 불러오기
   * @param  {string} email
   * @param  {string} password
   * @returns  {void}
   */
  public async setProfileImage(email: string, filename: string): Promise<void> {
    // 이미 존재하는 유저인지 확인
    const prismaClient = getClient();
    const userInstance: Record<string, unknown> | null = await prismaClient.user.findFirst({
      where: {
        email,
      },
      select: {
        email: true,
      },
    });
    if (userInstance === null) {
      throw new NotFoundError('유저를 찾을 수 없습니다.');
    }
    await prismaClient.user.update({
      where: {
        email,
      },
      data: {
        profileImageURL: filename,
      },
    });
  }
}
