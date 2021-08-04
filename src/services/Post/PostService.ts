import logger from '../../utils/logger';

export default class PostService {
  private static instance: PostService;

  /**
   * Service 인스턴스 생성시 로그 작성
   */
  private constructor() {
    logger.info('PostService Created');
  }

  /**
   * Service는 Singleton 패턴으로 작성
   */
  public static getInstance() {
    if (PostService.instance == null) PostService.instance = new PostService();
    return PostService.instance;
  }
}
