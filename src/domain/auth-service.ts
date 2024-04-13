import { UserRepository } from "../repositories/user-repository";
import { UserDb } from "../user/UserDb";
import bcrypt from "bcrypt"
import { randomUUID } from "crypto";
import { UserService } from "./user-service";
import { emailManager } from "../managers/email-manager";
import { WithId } from "mongodb";
import { usersCollection } from "../db/db";
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel";

export const authService = {


    async registerUser(login: string, email: string, password: string) : Promise<UserDb | null>{
        const user = await UserRepository.getUserByLoginOrEmail(login, email);
        
        if (user) return null

        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await UserService._generateHash(password, passwordSalt)
        // const createdAt = new Date()
        // const confirmationCodeExpirationDate = createdAt.setHours(createdAt.getHours() + 2)
        // const add = (hours: number | undefined, minutes: number | undefined) => {
        //     let date = new Date() 
        //     let date2
        //     if (hours){
        //         date2 = date.setHours(date.getHours() + hours)
        //     }
        
        //     if (minutes){
        //         date2 = date.setMinutes(date.getMinutes() + minutes)
        //     }
            
        //     return date2 
        
        // }
        
        const newUser: UserDb = {
            login,
            email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
            confirmationCode: randomUUID(),
            // confirmationCodeExpirationDate: confirmationCodeExpirationDate.toString(),
            isConfirmed: true
        }    

        const createUser = await UserRepository.createUser(newUser)

        if(createUser){
            emailManager.sendConfirmationCode(createUser)

        return newUser}

        return null
    },

    async confirmationCode(code: string){
        
        const user = await UserRepository.getUserByConfirmCode(code)
        
        if (!user){
            return null
        }  
        const date1 =new Date()
        const date2 = user.createdAt
        const date3 = new Date(date1).getTime() - new Date(date2).getTime()
        if (date3 < 5400000 ){
        await UserRepository.updateConfirm(user)
        return true
        }
        return false
    },

    async resendingCode(data: OutputUserType){

        const user = await UserRepository.getUserById(data.id) 
        
        if (!user) { return null} 
            
            const updateCode = await UserRepository.updateCode(user)

        if (!updateCode) { return null}

            emailManager.sendConfirmationCode(user) 
    
        return true
    }
}






