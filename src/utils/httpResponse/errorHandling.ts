import { Response } from "express";
import { BadRequestError, responseBadRequest } from "./ResponseBadRequest";
import { ConflictError, responseConflict } from "./ResponseConflict";
import { ForbiddenError, responseForbidden } from "./ResponseForbidden";
import { InternalServerError, responseInternalServerError } from "./ResponseInternalServerError";
import { NotFoundError, responseNotFound } from "./ResponseNotFound";
import { responseUnauthorized, UnauthorizedError } from "./ResponseUnauthorized";

export default function errorHandling(res: Response, error: Error): void {
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
    default:
      responseInternalServerError(res, { errorMessage: error.message });
      break;
  }
}