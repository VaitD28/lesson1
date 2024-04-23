import { UserRepository } from "../repositories/user-repository";
import { UserDb } from "../user/UserDb";
import { randomUUID } from "crypto";
import { emailManager } from "../managers/email-manager";
import { bcryptService } from "./bcrypt-service";
import { add } from "date-fns/add";
import { ResultStatus } from "../common/types/resultCode";
import { Result } from "../common/types/result.type";



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

        const createUser = await UserRepository.createUser(newUser)

        try{
            await emailManager.sendConfirmationCode(createUser!)
            
            }catch(e: unknown){
                console.error('Send email error', e)
            }
            return {
                status: ResultStatus.Success,
                data: newUser
            }
    },

    async confirmationCode(code: string) : Promise<Result<boolean | null>>{
        
        const user = await UserRepository.getUserByConfirmCode(code)
        
        if (!user) return {
            status: ResultStatus.BadRequest,
            errorMessage: 'confirmation code is incorrect',
            data: null
        }
        
        // if(user.isConfirmed){
        //     return false
        // }
        if (user.confirmationCode === code && new Date() < user.expirationDate){
            //Зачем проверка на соответствие коду, если мы по нему искали?
        await UserRepository.updateConfirm(user)
        
        return {
            status: ResultStatus.Success,
            data: null
        }
        }

        return {
            status: ResultStatus.BadRequest,
            errorMessage: 'expirationDate was expired',
            data: null
        }
    },

    async resendingCode(email: string) : Promise<boolean | null>{
        
        const user = await UserRepository.getUserByEmail(email) 

        if (!user){return false}

            const updateCode = await UserRepository.updateCode(user)

        if (!updateCode) { return null}

            await emailManager.sendConfirmationCode(updateCode) 
    
        return true
    }
}






