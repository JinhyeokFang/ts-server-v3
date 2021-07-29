import { Response } from 'express';
import { ResponseSuccessBody } from './ResponseBody';

export function responseSuccess(res: Response, body: ResponseSuccessBody): void {
  res.status(200).json(body);
}

export function responseSuccessWithPage(res: Response, pageName: string): void {
  res.render(pageName);
}