import bcrypt from "bcrypt"
import { UserDb} from "../user/UserDb";
import { userMapper } from "../mappers/userMapper";
import { UserRepository } from "../repositories/user-repository";
import { QueryUsersInputModel } from "../models/users/inputUsersModel/QueryUsersInputModel";
import { emailAdapter } from "../adapters/email-adapter";
import { randomUUID } from "crypto";


export const UserService = {
    
    async getAllUsers(data:QueryUsersInputModel){

    return UserRepository.getAllUsers(data)
    },

    async getUserById (id: string){
        const user = await UserRepository.getUserById(id)
        if (!user) return null
        return userMapper(user)
    },
    
    async createUser(login: string, email: string, password: string){

        const user = await UserRepository.getUserByLoginOrEmail(login, email)

        if (user) return null
        
        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserDb = {
            login,
            email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
            confirmationCode: randomUUID(),
            // confirmationCodeExpirationDate: new Date().toISOString(),
            isConfirmed: true
        }    

        const createUser =  await UserRepository.createUser(newUser)
        try{
            return userMapper
        } catch {
            console.error('Create Error')
            return
        }

            
        

    
    },
        
    async _generateHash (password: string, salt: string){
        
            const hash = bcrypt.hash(password, salt)
            return hash
        },

    async checkCredentials (loginOrEmail: string, password: string){
        const user = await UserRepository.findByLoginOrEmail(loginOrEmail)

        if(!user) return false

        const passwordHash = await this._generateHash(password, user.passwordSalt)


        if (passwordHash !== user.passwordHash) return false
        return user
    },

    async deleteUserById (id:string){
        return UserRepository.deleteUserById(id)
    },

    async checkUniqueLoginEmail (login: string, email: string){
        const user = await UserRepository.getUserByLoginOrEmail(login, email)
        if (!user){
            return true
        }else{
            return false
        }
    }
}