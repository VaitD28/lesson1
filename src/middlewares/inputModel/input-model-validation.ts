
import {Request, Response, NextFunction } from "express";
import {validationResult } from "express-validator";
import { HTTP_STATUSES } from "../../statuses";
import { errorHandler, errorHandlerForLogin } from "../../errorHandling/errorHandler";


export const inputModelValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({onlyFirstError: true}).map(error => errorHandler(error));
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages});
    }else {
        next()
    }
}

export const inputModelValidationForLogin = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({onlyFirstError: true}).map(error => errorHandlerForLogin(error));
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorsMessages});
    }else {
        next()
    }
}