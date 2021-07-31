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

export interface IReloginRequest extends Request {
    body: {
        refreshToken: string
    }
}
