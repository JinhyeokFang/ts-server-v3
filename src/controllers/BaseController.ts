import { Request, Router } from 'express';

export abstract class BaseController {
  public router: Router = Router();

  public abstract baseURL: string;
}

export interface RequestWithoutData extends Request {
  body: null
}
