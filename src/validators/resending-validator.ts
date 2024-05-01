import { body } from "express-validator";
import { inputModelValidation} from "../middlewares/inputModel/input-model-validation";
import { UserRepository } from "../repositories/user-repository";

export const resendingValidator = [
    body('email')
    .isString()
    .notEmpty()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Incorrect email')
    .custom(async email => {
        const user = await UserRepository.getUserByEmail(email)
        if(user!=null){
            if(user.isConfirmed){
                throw new Error('Email already confirmed')
            }else{
                return true}            
        }else{
            throw new Error('invalid Email')
        }
            
        }), 

    inputModelValidation
]