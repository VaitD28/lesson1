import { ObjectId, WithId } from "mongodb";
import { db } from "../db/db";
import { UserDb } from "../user/UserDb";
import { QueryUsersInputModel } from "../models/users/inputUsersModel/QueryUsersInputModel";
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel";
import { Pagination } from "../types/types";
import { userMapper } from "../mappers/userMapper";
import { randomUUID } from "crypto";
import { add } from "date-fns/add";


export const UserRepository = {

    async getAllUsers(data: QueryUsersInputModel): Promise<Pagination<OutputUserType>> {

        const sortData = {
            sortBy : data.sortBy ?? "createdAt",
            sortDirection : data.sortDirection ?? "desc",
            pageNumber : data.pageNumber ? +data.pageNumber: 1,
            pageSize : data.pageSize ? +data.pageSize: 10,
            searchLoginTerm : data.searchLoginTerm ?? null,
            searchEmailTerm : data.searchEmailTerm ?? null
        }
        
        let filter1 = {}
        let filter2 = {}
        let filter3 = {}

        const {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm} = sortData

        if(sortData.searchEmailTerm && sortData.searchLoginTerm){

            filter3 = {
                $or: [ { email: {$regex:sortData.searchEmailTerm, $options: 'i'} }, { login: {$regex:sortData.searchLoginTerm, $options: 'i'} } ] 
            }
        }else {
            if(sortData.searchEmailTerm || sortData.searchLoginTerm){

                if (sortData.searchLoginTerm){

                        filter2 = {
                            login: {
                                $regex: sortData.searchLoginTerm,
                                $options: 'i'
                            }
                        } 
            
                    }
            
                    if (sortData.searchEmailTerm){

                        filter1 = {
                            email: {
                                $regex: sortData.searchEmailTerm, 
                                $options: 'i'
                            }
                        }

                    }      
            }
        }

        const filter = Object.assign(filter1, filter2, filter3)




        const Users = await db.getCollections().usersCollection
        .find(filter)
        .sort(sortBy, sortDirection)
        .skip((pageNumber-1)*pageSize)
        .limit(pageSize)
        .toArray()
        

        
        const totalCount = await db.getCollections().usersCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / +pageSize)

        const userPag: Pagination<OutputUserType> = {
            pageSize,
            page: pageNumber,
            pagesCount,
            totalCount,
            items: Users.map(userMapper)
        }
        return userPag
    },

    async getUserById(id:string){
        const user = await db.getCollections().usersCollection.findOne({_id: new ObjectId(id)})
        return user
    },
    async createUser(data: UserDb) {
        const user = await db.getCollections().usersCollection.insertOne(data)
        return await db.getCollections().usersCollection.findOne ({_id: new ObjectId(user.insertedId.toString())})

    },

    async findByLoginOrEmail(loginOrEmail: string){
        const user = await db.getCollections().usersCollection.findOne({$or: [{login: loginOrEmail},{email:loginOrEmail}]})
        return user
    },

    async deleteUserById(id: string): Promise<boolean> {
        try{
            const user = await db.getCollections().usersCollection.deleteOne({_id: new ObjectId(id)})
            return !!user.deletedCount
        }catch(e){
            return false}
    },
    
    async getUserByLoginOrEmail(loginOrEmail:string) {

        const findUserByLogin = await db.getCollections().usersCollection.findOne({login:loginOrEmail})
        if(findUserByLogin){
            return findUserByLogin
        }else{
            const findUserByEmail = await db.getCollections().usersCollection.findOne({email:loginOrEmail})
                if(findUserByEmail){
                    return findUserByEmail
                }else{
                    return false
                }
        }
    },

    async getUserByConfirmCode(code: string){ 
        const user = await db.getCollections().usersCollection.findOne({confirmationCode: code})
        console.log(user)
        if (user){
            return  user
        }else{
            return false}

    },


    async getUserByEmail(email: string){ 
        const user = await db.getCollections().usersCollection.findOne({email: email})
        if (user){
            return  user
        }else{
            return false}
    },

    async updateConfirm(user: WithId<UserDb>){
        const res = await db.getCollections().usersCollection.updateOne({_id: user._id}, {
            $set: {
                isConfirmed: true
            }
        })

        return !!res.matchedCount
    },

    async updateCode(user: WithId<UserDb>){
        
        const res = await db.getCollections().usersCollection.updateOne({_id: user._id}, {
            $set: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }),
            }
        })
        console.log(res)

        return await db.getCollections().usersCollection.findOne(user._id)
    }
}