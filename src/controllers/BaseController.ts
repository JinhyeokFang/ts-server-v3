import { Router } from 'express';

export default abstract class BaseController {
  public router: Router = Router();

  public abstract baseURL: string;
}
