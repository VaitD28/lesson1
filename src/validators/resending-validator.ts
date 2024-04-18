import { body } from "express-validator";
import { inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import { authService } from "../domain/auth-service";

export const resendingValidator = [
    body('email')
    .isString()
    .notEmpty()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Incorrect email')
    .custom(async email => {
        const user = await authService.checkUniqueUser(email)
        if(user){
                throw new Error('invalid Email')
        }
    
    }), 

    inputModelValidation
]