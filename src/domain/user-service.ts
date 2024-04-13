import bcrypt from "bcrypt"
import { UserDb} from "../user/UserDb";
import { userMapper } from "../mappers/userMapper";
import { UserRepository } from "../repositories/user-repository";
import { QueryUsersInputModel } from "../models/users/inputUsersModel/QueryUsersInputModel";
import { randomUUID } from "crypto";
import { bcryptService } from "./bcrypt-service";
import { add } from "date-fns/add";
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel";
import { WithId } from "mongodb";


export const UserService = {
    
    async getAllUsers(data:QueryUsersInputModel){

    return UserRepository.getAllUsers(data)
    },

    async getUserById (id: string): Promise<OutputUserType | null>{
        const user = await UserRepository.getUserById(id)
        if (!user) return null
        return userMapper(user)
    },
    
    async createUser(login: string, email: string, password: string): Promise< OutputUserType | null>{

        const user = await UserRepository.getUserByLoginOrEmail(login, email)

        if (user) return null
        

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
            isConfirmed: true
        }    

        const createUser =  await UserRepository.createUser(newUser)
        
        if (!createUser) return null
        
        return userMapper(createUser)
    
    },

    async _generateHash (password: string, salt: string):  Promise<string>{
        
            const hash = bcrypt.hash(password, salt)
            return hash
        },

    async checkCredentials (loginOrEmail: string, password: string){
        const user = await UserRepository.findByLoginOrEmail(loginOrEmail)

        if(!user) return false

        const checkPassword = await bcryptService.checkPassword(password, user.passwordHash)


        if (!checkPassword) return false
        return user
    },

    async deleteUserById (id:string): Promise<boolean>{
        return UserRepository.deleteUserById(id)
    },

    async checkUniqueLoginEmail (login: string, email: string): Promise<boolean>{
        const user = await UserRepository.getUserByLoginOrEmail(login, email)
        if (!user){
            return true
        }else{
            return false
        }
    }
}