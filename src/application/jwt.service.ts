import { WithId } from "mongodb"
import { appConfig } from "../db/db"
import { UserDb } from "../user/UserDb"
import jwt from 'jsonwebtoken'
import { TokenRepository } from "../repositories/token-repository"
import { UserRepository } from "../repositories/user-repository"
export const jwtService = {
    async CreateJWT(user: WithId<UserDb>, tokenLife: number, JWT_SECRET: string ) {
        const token = jwt.sign({UserId: user._id}, JWT_SECRET, {expiresIn: tokenLife}) 

    return token
    },

    async getUserIdByACCToken (token: string){
        try{
        const result :any = jwt.verify(token, appConfig.JWT_SECRET_ACC)
        return result.UserId
        }catch(e){
        return null
        }
    },

    async getUserIdByREFToken (token: string){
        try{
        const result :any = jwt.verify(token, appConfig.JWT_SECRET_REF)
        return result.UserId
        }catch(e){
        return null
        }
    },  
    
    async getUserByREFToken (token: string){
        try{
        const result :any = jwt.verify(token, appConfig.JWT_SECRET_REF)
        const user = await UserRepository.getUserById(result.UserId)
        return user
        }catch(e){
        return null
        }
    },  
    
    
    async forBlackList (token: string){
        const user = await jwtService.getUserByREFToken(token) 
        console.log(user, 'user')
        if (user) {
            const BlackToken = await TokenRepository.getByUserId(user._id)
            console.log('BlackToken', BlackToken)
            if(!BlackToken){
                const CreateData = {
                    userId: user._id,
                    tokens: [token]
                }
                const createBlackList = await TokenRepository.createForBlackList(CreateData)
                console.log('createBlackList', createBlackList)
                return createBlackList
            }
           const updateData = {
            token
           }
           console.log(updateData, 'updateData')
            const updateBlackList = await TokenRepository.updateBlackList(BlackToken._id, updateData)
            console.log(updateBlackList, 'updateBlackList')
            return updateBlackList
        }
        
        return null

    }
}   