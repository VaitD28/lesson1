import { cookie } from "express-validator"
import { jwtService } from "../application/jwt.service"
import { inputModelValidation } from "../middlewares/inputModel/input-model-validation"
import { db } from "../db/db"

export const jwtValidator = [
    cookie('refreshToken')
    .isString()
    .withMessage('Incorrect refreshToken! RefreshToken must be a string')
    .trim()
    .notEmpty()
    .withMessage('Incorrect refreshToken! RefreshToken should be some information')
    .custom(async refreshToken => {
        const isValid = await jwtService.getUserIdByREFToken(refreshToken)
        const BlackToken = await db.getCollections().tokenBlackListCollection.findOne(refreshToken) 
    if (!isValid || BlackToken){
        throw new Error('Incorrect refreshToken')
    }
        return true
    }
    ),

    inputModelValidation
]