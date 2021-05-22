import { Router, Request, Response } from 'express';
import { BaseController } from '../BaseController';

export class IndexController extends BaseController {
  public constructor() {
    super();
    this.router.get('/', this.index);
  }

  private index(req: Request, res: Response): void {
    super.ResponseSuccessWithPage(res, 'index');
  }

  public get controllerRouter(): Router {
    return this.router;
  }
}

export default new IndexController().controllerRouter;
