import { body } from "express-validator";
import { inputModelValidation, inputModelValidationForLogin } from "../middlewares/inputModel/input-model-validation";

export const userLogValidation = [   
    body('loginOrEmail')
    .isString()
    .notEmpty()
    .withMessage('Incorrect login or password'),

    body('password')
    .isString()
    .notEmpty()
    .withMessage('Incorrect login or password'),

    inputModelValidationForLogin
]

export const userPostValidation = [   
    body('login')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Incorrect login or password'),

    body('email')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Incorrect login or password'),

    body('password')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Incorrect login or password'),

    inputModelValidation
]