
import {Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import { errorHandler } from "../../errorHandling/errorHandler";
import { HTTP_STATUSES } from "../../statuses";

export const inputModelValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    // .formatWith((error:ValidationError) => {
    //     switch (error.type) {
    //         case "field":
    //             return {
    //                 message: error.msg,
    //                 field: error.path
    //             }
    //         default:
    //             return {
    //                 message: error.msg,
    //                 field: 'not found'
    //             }
    //     }
    // })

    // if (!errors.isEmpty()){
    //     const err = errors.array ({onlyFirstError: true}) 
    //     return res.sendStatus(404).send({errorMessages: err})
    // }
    
    // return next()
    if (!errors.isEmpty()) {
        const errorMessages = errors.array({onlyFirstError: true}).map(error => errorHandler(error));
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errorMessages});
    }else {
        next()
    }
}