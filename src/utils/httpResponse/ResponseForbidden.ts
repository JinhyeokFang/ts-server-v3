import { Response } from 'express';
import { ResponseFailedBody } from './ResponseBody';

export function responseForbidden(res: Response, body: ResponseFailedBody): void {
  res.status(403).json(body);
}

export class ForbiddenError extends Error {
  public constructor(message: string) {
    super();
    this.message = message;
  }
}