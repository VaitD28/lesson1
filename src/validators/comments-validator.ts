import { body } from "express-validator";
import { inputModelValidation } from "../middlewares/inputModel/input-model-validation";

export const commentsValidator = [
    body('content')
    .isLength({min: 20, max:300})
    .withMessage('Incorrect content!'), 
    
    inputModelValidation
]