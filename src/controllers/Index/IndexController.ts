import { Request, Response } from 'express';
import { responseOKWithPage } from 'ts-response';
import BaseController from '../BaseController';

export default class IndexController extends BaseController {
  public constructor() {
    super();
    this.router.get('/', this.index);
  }

  private index(req: Request, res: Response): void {
    responseOKWithPage(res, 'index');
  }
}
