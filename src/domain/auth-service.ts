import { UserRepository } from "../repositories/user-repository";
import { UserDb } from "../user/UserDb";
import { randomUUID } from "crypto";
import { emailManager } from "../managers/email-manager";
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel";
import { bcryptService } from "./bcrypt-service";

export const authService = {


    async registerUser(login: string, email: string, password: string) : Promise<UserDb | null>{
        const user = await UserRepository.getUserByLoginOrEmail(login, email);
        
        if (user) return null

        const passwordHash = await bcryptService.generateHash(password)
        
        const newUser: UserDb = {
            login,
            email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
            confirmationCode: randomUUID(),
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






