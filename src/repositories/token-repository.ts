import { ObjectId } from "mongodb";
import { db } from "../db/db";
import {TokenDb, TokenUpdateModel } from "../token/token-db";

export const TokenRepository = {
    async getByUserId(userId: ObjectId){
        const user = await db.getCollections().tokenBlackListCollection.findOne({userId: userId})
        if(!user) {return false}
        return user
    },

    async createForBlackList (data: TokenDb) {
        
        const getUserById = await db.getCollections().tokenBlackListCollection.findOne(data.userId)

        if (!getUserById){
            const blackToken = await db.getCollections().tokenBlackListCollection.insertOne(data)
            return true
        }
        return null
    },
    
    async updateBlackList (userId: ObjectId, data: TokenUpdateModel) {
        console.log(data, 'data')
        console.log(userId, 'userId')
        try{
            const updateUser = await db.getCollections().tokenBlackListCollection.updateOne({_id: userId}, {
            $push: {tokens: data.token}})
            return updateUser
        }catch(error){
           console.log(error)
           return
        }
        


    
    }}