import { Request } from 'express';

export interface ILoginRequest extends Request {
  body: {
    username: string,
    password: string
  }
}

export interface IRegisterRequest extends Request {
  body: {
    username: string,
    password: string
  }
}

export interface IRemoveRequest extends Request {
  body: {
    username: string,
    password: string
  }
}

export interface IRefreshRequest extends Request {
}

export interface IPatchProfileRequest extends Request {
  file?: {
    filename: string
  }
}
