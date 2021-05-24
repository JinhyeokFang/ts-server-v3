import { PostModel } from '../../models/Post/PostModel';
import Logger from '../../utils/Logger';

export default class PostService {
  private static instance: PostService;

  private constructor() {
    Logger.info('PostService Created');
  }

  public static getInstance() {
    if (PostService.instance == null) PostService.instance = new PostService();
    return PostService.instance;
  }
}
