import { body } from "express-validator";
import { inputModelValidation, inputModelValidationForLogin } from "../middlewares/inputModel/input-model-validation";

export const userLogValidation = [   
    body('loginOrEmail')
    .isString(),

    body('password')
    .isString(),

    inputModelValidationForLogin
]

export const userPostValidation = [   
    body('login')
    .isString()
    .isLength({min: 3, max: 10})
    .trim()
    .withMessage('Incorrect login or password'),

    body('email')
    .isString()
    .notEmpty()
    .matches('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
    .withMessage('Incorrect login or password'),

    body('password')
    .isString()
    .isLength({min: 6, max: 20})
    .trim()
    .withMessage('Incorrect login or password'),

    inputModelValidation
]