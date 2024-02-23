import { body } from "express-validator";
import { inputModelValidation, inputModelValidationForLogin } from "../middlewares/inputModel/input-model-validation";

export const userLogValidation = [   
    body('loginOrEmail')
    .isString()
    .isLength({min:1,max:500})
    .withMessage('Incorrect login or password'),

    body('password')
    .isString()
    .isLength({min:1,max:500})
    .withMessage('Incorrect login or password'),

    inputModelValidationForLogin
]

export const userPostValidation = [   
    body('login')
    .isString()
    .trim()
    .isLength({min:5,max:500})
    .withMessage('Incorrect login or password'),

    body('email')
    .isString()
    .trim()
    .isLength({min:1,max:500})
    .withMessage('Incorrect login or password'),

    body('password')
    .isString()
    .trim()
    .isLength({min:1,max:500})
    .withMessage('Incorrect login or password'),

    inputModelValidation
]