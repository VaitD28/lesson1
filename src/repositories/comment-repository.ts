import { CommentDb } from "../comment/comment-db"
import { commentsCollection } from "../db/db"
import { ObjectId } from "mongodb";
import { CommentUpdateModel } from "../models/comments/inputCommentModel/CommentUpdateModel";

export const CommentRepository = {

    async createComment(newComment: CommentDb ){
        const result = await commentsCollection.insertOne(newComment)
        return result.insertedId.toString()
    },

    async deleteCommentById(id: string){
        try{
            const res= await commentsCollection.deleteOne({_id: new ObjectId(id)})
            
            return !!res.deletedCount
        }catch(e){
            return false}

        
    },

    async updateCommentById(id: string, data: CommentUpdateModel){
        try{
            const updateComment = await commentsCollection.updateOne({_id: new ObjectId(id)}, {
                $set:{
                    content: data.content
                }
            })

        return !!updateComment.matchedCount
        
        }catch(e){
            return false
        }
    }
    
}