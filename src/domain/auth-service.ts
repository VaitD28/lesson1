import { UserRepository } from "../repositories/user-repository";
import { UserDb } from "../user/UserDb";
import { randomUUID } from "crypto";
import { emailManager } from "../managers/email-manager";
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel";
import { bcryptService } from "./bcrypt-service";
import { add } from "date-fns/add";



export const authService = {

    async ResendingCodeByEmail(email:string){

        const user = await UserRepository.getUserByEmail(email)
        console.log(user)

        if (user) {
            if (!user.isConfirmed) {
                
                await emailManager.sendConfirmationCode(user)

                return true
            }
            return false
        }else{
            return false
        }
    
    },

    async checkUniqueUser(loginOrEmail: string ) {
        const user = await UserRepository.getUserByLoginOrEmail(loginOrEmail);
        
        if (user) return false

        return true
    },

    async registerUser(login: string, email: string, password: string) : Promise<UserDb | null>{
        
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

        const createUser = await UserRepository.createUser(newUser)

        if(createUser){
            await emailManager.sendConfirmationCode(createUser)

        return newUser}

        return null
    },

    async confirmationCode(code: string) : Promise<boolean | null>{
        
        const user = await UserRepository.getUserByConfirmCode(code)
        
        if (!user){
            return false
        }  
        // if(user.isConfirmed){
        //     return false
        // }
        if (user.confirmationCode === code && new Date() < user.expirationDate){

        await UserRepository.updateConfirm(user)
        return true
        }
        return false
    },

    async resendingCode(data: OutputUserType) : Promise<boolean | null>{

        const user = await UserRepository.getUserById(data.id) 
        
        if (!user) { return null} 
            
            const updateCode = await UserRepository.updateCode(user)

        if (!updateCode) { return null}

            emailManager.sendConfirmationCode(user) 
    
        return true
    }
}






