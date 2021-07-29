import { Response } from "express";
import { ResponseFailedBody } from "./ResponseBody";

export function responseConflict(res: Response, body: ResponseFailedBody): void {
  res.status(409).json(body);
}

export class ConflictError extends Error {
  public constructor(message: string) {
    super();
    this.message = message;
  }
}