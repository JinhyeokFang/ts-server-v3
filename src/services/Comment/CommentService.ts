import logger from '../../modules/logger';

export default class CommentService {
  private static instance: CommentService;

  /**
   * Service 인스턴스 생성시 로그 작성
   */
  private constructor() {
    logger.info('CommentService Created');
  }

  /**
   * Service는 Singleton 패턴으로 작성
   */
  public static getInstance(): CommentService {
    if (CommentService.instance == null) CommentService.instance = new CommentService();
    return CommentService.instance;
  }
}
