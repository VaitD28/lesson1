import { body } from "express-validator";
import { inputModelValidation, inputModelValidationForLogin } from "../middlewares/inputModel/input-model-validation";

export const userLogValidation = [   
    body('loginOrEmail')
    .isString()
    .withMessage('Incorrect login or password'),

    body('password')
    .isString()
    .withMessage('Incorrect login or password'),

    inputModelValidationForLogin
]

export const userPostValidation = [   
    body('login')
    .isString()
    .isLength({min: 3, max: 10})
    .trim()
    .withMessage('Incorrect login'),

    body('email')
    .isString()
    .notEmpty()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Incorrect email'),
    // .custom(async email => {
    // if (email !== new RegExp('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')){
    //     throw new Error('Incorrect email')
    // }
    //     return true
    // }
    // ), 


    body('password')
    .isString()
    .isLength({min: 6, max: 20})
    .trim()
    .withMessage('Incorrect password'),

    inputModelValidation
]