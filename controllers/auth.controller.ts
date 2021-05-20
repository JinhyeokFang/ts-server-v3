import { Router, Request, Response } from 'express';

import { BaseController } from './base.controller';
import { JWT, TokenStatus } from '../utils/jwt';

export class AuthController extends BaseController {
    public constructor () {
        super();
        this.router.post('/login', this.login);
        this.router.post('/register', this.register);
        this.router.post('/relogin', this.relogin);
        this.router.post('/tokenCheck', this.tokenData);
    }
    
    private async login(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;
        
        try {

            
            super.ResponseSuccess(res, {accessToken: JWT.createAccessToken({username}), refreshToken: JWT.createRefreshToken({username})});
        } catch (error) {
            // if () {
            //     super.ResponseNotFound(res, { error: "User Not Found" });
            // } else {
            //     super.ResponseInternalServerError(res, { error: "DB Error", meesage: error.message });
            // }
        }
    }
    
    private async register(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        try {
            super.ResponseSuccess(res, {});
        } catch (error) {
            // if () {
            //     super.ResponseForbidden(res, { error: "User Already Exist" });
            // } else {
            //     super.ResponseInternalServerError(res, { error: "DB Error", meesage: error.message });
            // }    
        }
    }

    private async relogin(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.body;  

        const result = JWT.checkRefreshToken(refreshToken);
        if (result.status == TokenStatus.OK) {
            super.ResponseSuccess(res, {accessToken: JWT.createAccessToken(result.userData ? result.userData : {}), refreshToken: JWT.createRefreshToken(result.userData ? result.userData : {})});
        } else if (result.status == TokenStatus.Expired) {
            super.ResponseForbidden(res, {error: "Token Is Expired" });
        } else {
            super.ResponseBadRequest(res, {error: "Token Is Wrong" });
        }
    }

    private async tokenData(req: Request, res: Response): Promise<void> {
        const { token } = req.body;  

        const tokenObject = JWT.decodeToken(token);
        const checkAccessToken = JWT.checkAccessToken(token);
        const checkRefreshToken = JWT.checkRefreshToken(token);
        super.ResponseSuccess(res, { tokenObject, accessTokenOK: checkAccessToken.status == TokenStatus.OK, refreshTokenOK: checkRefreshToken.status == TokenStatus.OK });
    }

    public get controllerRouter(): Router {
        return this.router
    }
}


export default new AuthController().controllerRouter;