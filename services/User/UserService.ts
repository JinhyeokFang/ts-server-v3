// createUser
// getUser
// removeUser
// editUser

import { UserModel } from '../../models/User/UserModel';
import Logger from '../../utils/Logger';

export default class UserService {
  private static instance: UserService;

  private constructor() {
    Logger.info('UserService Created');
  }

  public static getInstance() {
    if (UserService.instance == null) UserService.instance = new UserService();
    return UserService.instance;
  }

  public async createUser(username: string, password: string): Promise<boolean> {
    try {
      await UserModel.create({ username, password });
      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
