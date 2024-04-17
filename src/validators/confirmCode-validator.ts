import { body } from "express-validator";
import { inputModelValidation } from "../middlewares/inputModel/input-model-validation";
export const confirmCodeValidation = [   
    body('code')
    .isString()
    .withMessage('Incorrect code'),

    inputModelValidation
]