import { body } from "express-validator";
import { inputModelValidation, inputModelValidationForLogin } from "../middlewares/inputModel/input-model-validation";

export const resendingValidator = [
    body('email')
    .isString()
    .notEmpty()
    // .matches('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
    .withMessage('Incorrect login or password'),
    
    inputModelValidation
]