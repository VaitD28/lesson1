import { body } from "express-validator";
import { inputModelValidation } from "../middlewares/inputModel/input-model-validation";
import { authService } from "../domain/auth-service";
import { UserRepository } from "../repositories/user-repository";
export const confirmCodeValidation = [   
    body('code')
    .isString()
    .withMessage('Incorrect code')
    .custom(async code => {
        const user = await UserRepository.getUserByConfirmCode(code)
        console.log(user)
        if(user){
            if (user.isConfirmed) {
                throw new Error('Email already confirmed')
            }else return true
        }
        throw new Error('invalid code')
    }
    ), 

    inputModelValidation
]