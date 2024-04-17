import { body } from "express-validator";
import { inputModelValidation, inputModelValidationForLogin } from "../middlewares/inputModel/input-model-validation";
import { authService } from "../domain/auth-service";
import { UserService } from "../domain/user-service";

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
    // .custom(async login => {
    //     const checkUniqueEmail = await authService.checkUniqueByEmail(email)
    // if (!checkUniqueEmail){
    //     throw new Error('Incorrect email')
    // }
    //     return true
    // }
    // ), 

    body('email')
    .isString()
    .notEmpty()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Incorrect email')
    .custom(async email => {
        const checkUniqueEmail = await authService.checkUniqueByEmail(email)
    if (!checkUniqueEmail){
        throw new Error('Incorrect email')
    }
        return true
    }
    ), 


    body('password')
    .isString()
    .isLength({min: 6, max: 20})
    .trim()
    .withMessage('Incorrect password'),

    inputModelValidation
]