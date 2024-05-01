import { WithId } from "mongodb";
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel";
import { UserDb } from "../user/UserDb";
import { OutputUserDb } from "../models/users/outputUserModel.ts/OutputUserDb";


export const userMapper = (user: WithId<UserDb>): OutputUserType => {
    return{
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt
    }   
}

export const userMapperAllInf = (user: WithId<UserDb>): OutputUserDb => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        confirmationCode: user.confirmationCode,
        expirationDate: user.expirationDate ,
        isConfirmed: user.isConfirmed 
    }
}