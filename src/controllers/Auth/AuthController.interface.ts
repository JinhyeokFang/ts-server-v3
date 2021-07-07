import { Request } from 'express';

export interface LoginRequest extends Request {
    body: {
        username: string,
        password: string
    }
}

export interface RegisterRequest extends Request {
    body: {
        username: string,
        password: string
    }
}

export interface RemoveRequest extends Request {
    body: {
        username: string,
        password: string
    }
}

export interface ReloginRequest extends Request {
    body: {
        refreshToken: string
    }
}

export interface TokenDataRequest extends Request {
    body: {
        token: string
    }
}
