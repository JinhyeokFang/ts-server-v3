import { Response, Router } from 'express';

export interface ResponseSuccessBody {
  data?: Record<string, unknown>,
  message?: string
}

export interface ResponseFailedBody {
  errorMessage?: string,
  errorCode?: number
}

export abstract class BaseController {
  public router: Router = Router();

  protected ResponseSuccess(res: Response, body: ResponseSuccessBody): void {
    res.status(200).json(body);
  }

  protected ResponseSuccessWithPage(res: Response, pageName: string): void {
    res.render(pageName);
  }

  protected ResponseBadRequest(res: Response, body: ResponseFailedBody): void {
    res.status(400).json(body);
  }

  protected ResponseUnauthorized(res: Response, body: ResponseFailedBody): void {
    res.status(401).json(body);
  }

  protected ResponseForbidden(res: Response, body: ResponseFailedBody): void {
    res.status(403).json(body);
  }

  protected ResponseNotFound(res: Response, body: ResponseFailedBody): void {
    res.status(404).json(body);
  }

  protected ResponseConflict(res: Response, body: ResponseFailedBody): void {
    res.status(409).json(body);
  }

  protected ResponseImATeaPot(res: Response, body: ResponseFailedBody): void {
    res.status(418).json(body);
  }

  protected ResponseInternalServerError(res: Response, body: ResponseFailedBody): void {
    res.status(500).json(body);
  }
}
