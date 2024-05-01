import { body } from "express-validator";
import { inputModelValidation } from "../middlewares/inputModel/input-model-validation";
import { UserRepository } from "../repositories/user-repository";
export const confirmCodeValidation = [   
    body('code')
    .isString()
    .withMessage('Incorrect code')
    .custom(async code => {
        console.log(code, 'code for confirm')
        const user = await UserRepository.getUserByConfirmCode(code)
        // потом удалить
        //const allUsers = await db.getCollections().usersCollection.find({}).toArray()
        if(user!=null){
            if (user.isConfirmed) {
                throw new Error('Email already confirmed')
            }else{
                return true
            }
        }else{
       //     throw new Error(`invalid code  ${JSON.stringify(allUsers)}`)
            throw new Error(`invalid code`)
        }
    }
    ), 

    inputModelValidation
]