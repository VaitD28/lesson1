import { ObjectId } from "mongodb";
import { CommentDb } from "../comment/comment-db";
import { commentsCollection } from "../db/db";
import { OutputCommentType } from "../models/comments/outputCommentModel/comment.output.models";
import { commentMapper } from "../mappers/commentMapper";
import { QueryPostCommentInputModel } from "../models/comments/inputCommentModel/query.comment.input.model";

export const CommentQueryRepository = {
    async getCommentById(id: string): Promise<OutputCommentType | null>{
        try {
            const comment = await commentsCollection.findOne({_id : new ObjectId(id)})
            
            if(!comment){
                return null
            }
            
            return commentMapper(comment)

        }catch(e){
            return null
        }
    },
    


    async getCommentsByPostId(postId: string, data: QueryPostCommentInputModel) {
        
        const sortData = {
            sortBy: data.sortBy ?? "createdAt",
            sortDirection: data.sortDirection ?? "desc",
            pageNumber: data.pageNumber ? +data.pageNumber : 1,
            pageSize: data.pageSize ? +data.pageSize : 10
        }   
        const {sortBy, sortDirection, pageNumber, pageSize} = sortData
        
        const comments = await commentsCollection
        .find({postId: postId})
        .sort(sortBy, sortDirection)
        .skip((pageNumber-1)*pageSize)
        .limit(pageSize)
        .toArray()
        
        const totalCount = await commentsCollection.countDocuments({postId:postId})
        const pagesCount = Math.ceil(totalCount / +pageSize)

            return {
                pageSize,
                page: pageNumber,
                pagesCount,
                totalCount,
                items: comments.map(commentMapper)
            }
    }
}