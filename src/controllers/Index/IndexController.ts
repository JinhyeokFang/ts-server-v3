import { Request, Response } from 'express';
import { responseSuccessWithPage } from '../../utils/httpResponse/ResponseSuccess';
import BaseController from '../BaseController';

export default class IndexController extends BaseController {
  public constructor() {
    super();
    this.router.get('/', this.index);
  }

  private index(req: Request, res: Response): void {
    responseSuccessWithPage(res, 'index');
  }
}
