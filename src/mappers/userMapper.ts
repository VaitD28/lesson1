import { WithId } from "mongodb";
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel";
import { UserDb } from "../user/UserDb";


export const userMapper = (user: WithId<UserDb>): OutputUserType => {
    return{
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt
    }   
}