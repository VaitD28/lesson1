import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel";
import { UserDb } from "../user/UserDb";

declare global {
    declare namespace Express {
        export interface Request {
            user: OutputUserType | null 
        }
    }
}