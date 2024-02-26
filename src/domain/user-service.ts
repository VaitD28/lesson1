import { UserCreateModel } from "../models/users/inputUsersModel/UserCreateModel";
import bcrypt from "bcrypt"
import { UserDb} from "../user/UserDb";
import { userMapper } from "../mappers/userMapper";
import { UserRepository } from "../repositories/user-repository";
import { QueryUsersInputModel } from "../models/users/inputUsersModel/QueryUsersInputModel";


export const UserService = {
    
    async getAllUsers(data:QueryUsersInputModel){

    return UserRepository.getAllUsers(data)
    },

    async getUserById (id: string){
        const user = await UserRepository.getUserById(id)
        if (!user) return null
        return userMapper(user)
    },
    
    async createUser(data: UserCreateModel): Promise<string> {
        const login = data.login
        const email = data.email
        const password = data.password

        
        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserDb = {
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
        }    
        return UserRepository.createUser(newUser)
    
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
        return true
    },

    async deleteUserById (id:string){
        return UserRepository.deleteUserById(id)
    }


}