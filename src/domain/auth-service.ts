import { UserRepository } from "../repositories/user-repository";
import { UserDb } from "../user/UserDb";
import { randomUUID } from "crypto";
import { emailManager } from "../managers/email-manager";
import { bcryptService } from "./bcrypt-service";
import { add } from "date-fns/add";
import { ResultStatus } from "../common/types/resultCode";
import { Result } from "../common/types/result.type";
import { jwtService } from "../application/jwt.service";
import { appConfig } from "../db/db";



export const authService = {

    async checkUniqueUser(loginOrEmail: string ) {
        const user = await UserRepository.getUserByLoginOrEmail(loginOrEmail);
        
        if (user) return false

        return true
    },

    async registerUser(login: string, email: string, password: string) : Promise<Result<UserDb | null>>{
        
        const passwordHash = await bcryptService.generateHash(password)
        
        const newUser: UserDb = {
            login,
            email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 30,
            }),
            isConfirmed: false
        }    
        console.log(newUser)
        const createUser = await UserRepository.createUser(newUser)
        console.log(createUser, 'createUser')
        try{
            await emailManager.sendConfirmationCode(createUser!)
            
            }catch(e: unknown){
                console.error('Send email error', e)
            }
            return {
                status: ResultStatus.Success,
                data: createUser
            }
    },

    async confirmationCode(code: string) : Promise<Result<boolean | null>>{
        
        const user = await UserRepository.getUserByConfirmCode(code)

        if (new Date() < user!.expirationDate){
            const isUpdate = await UserRepository.updateIsConfirm(user!)
            if(isUpdate){
                return {
                status: ResultStatus.Success,
                data: null
                }
            }
        }

        return {
            status: ResultStatus.BadRequest,
            errorMessage: 'expirationDate was expired',
            data: null
        }
    },

    async resendingCode(email: string){
        
        const user = await UserRepository.getUserByEmail(email) 

        const updateCode = await UserRepository.updateCode(user!)
        
        await emailManager.sendConfirmationCode(updateCode!) 
    
        return {
            status: ResultStatus.Success,
            errorMessage: 'ConfirmationCode was sent',
            data: null
        }},

    async updateToken(refreshToken: string){

        const user = await jwtService.getUserByREFToken(refreshToken)


        if (user) {
    
            await jwtService.forBlackList(refreshToken)
    
            const newAccessToken = await jwtService.CreateJWT(user, appConfig.accessTokenLife, appConfig.JWT_SECRET_ACC)
    
            const newRefreshToken = await jwtService.CreateJWT(user, appConfig.refreshTokenLife, appConfig.JWT_SECRET_REF)
    
            const accToken = {
            "accessToken": newAccessToken
            }

            const tokens =  {
                accToken,
                newRefreshToken
            } 

            return tokens
        }

        return false
    },

    async TokenInBlackList(refreshToken: string){
            const insertOnBlackList = await jwtService.forBlackList(refreshToken)
            if(insertOnBlackList){
                return true
            }
            return false
    }

}