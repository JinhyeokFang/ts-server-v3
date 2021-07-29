import { Response } from 'express';
import { ResponseFailedBody } from './ResponseBody';

export function responseNotFound(res: Response, body: ResponseFailedBody): void {
  res.status(404).json(body);
}

export class NotFoundError extends Error {
  public constructor(message: string) {
    super();
    this.message = message;
  }
}