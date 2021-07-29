import { Response } from 'express';
import { ResponseFailedBody } from './ResponseBody';

export function responseBadRequest(res: Response, body: ResponseFailedBody): void {
  res.status(400).json(body);
}

export class BadRequestError extends Error {
  public constructor(message: string) {
    super();
    this.message = message;
  }
}