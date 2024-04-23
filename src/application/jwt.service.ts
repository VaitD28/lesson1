import { ObjectId, WithId } from "mongodb"
import { appConfig } from "../db/db"
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel"
import { UserDb } from "../user/UserDb"
import jwt from 'jsonwebtoken'
export const jwtService = {
    async CreateJWT(user: WithId<UserDb>) {
        const token = jwt.sign({UserId: user._id}, appConfig.JWT_SECRET, {expiresIn: '1h'}) 

    return token
    },

    async getUserIdByToken (token: string){
        try{
        const result :any = jwt.verify(token, appConfig.JWT_SECRET)
        return new ObjectId(result.UserId)
        }catch(e){
        return null
        }
    }
}   