import { Response, Router } from "express";
import { BadRequestError, responseBadRequest } from "../utils/httpResponse/ResponseBadRequest";
import { ConflictError, responseConflict } from "../utils/httpResponse/ResponseConflict";
import { ForbiddenError, responseForbidden } from "../utils/httpResponse/ResponseForbidden";
import { InternalServerError, responseInternalServerError } from "../utils/httpResponse/ResponseInternalServerError";
import { NotFoundError, responseNotFound } from "../utils/httpResponse/ResponseNotFound";
import { responseUnauthorized, UnauthorizedError } from "../utils/httpResponse/ResponseUnauthorized";

export default abstract class BaseController {
  public router: Router = Router();

  protected errorHandling(res: Response, error: Error): void {
    switch (error.constructor) {
      case BadRequestError:
        responseBadRequest(res, { errorMessage: error.message });
        break;
      case UnauthorizedError:
        responseUnauthorized(res, { errorMessage: error.message });
        break;
      case ForbiddenError:
        responseForbidden(res, { errorMessage: error.message });
        break;
      case NotFoundError:
        responseNotFound(res, { errorMessage: error.message });
        break;
      case ConflictError:
        responseConflict(res, { errorMessage: error.message });
        break;
      case InternalServerError:
        responseInternalServerError(res, { errorMessage: error.message });
        break;
      default:
        break;
    }
  }
}