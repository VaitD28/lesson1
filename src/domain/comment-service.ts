import { CommentDb } from "../comment/comment-db"
import { CommentUpdateModel } from "../models/comments/inputCommentModel/CommentUpdateModel"
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel"
import { CommentRepository } from "../repositories/comment-repository"
import { CommentQueryRepository } from "../repositories/comment.query.repository"
import { PostQueryRepository } from "../repositories/post.query.repository"

export const CommentService = {
    async createComment(id: string, content: string, userData: OutputUserType) {
        const post = await PostQueryRepository.getPostById(id)
        const createDat = new Date()
        
        if (post){
            const newComment: CommentDb = {
                postId: id,
                content, 
                commentatorInfo: {
                    userId: userData.id,
                    userLogin: userData.login
                },
                createdAt: createDat.toISOString()
            }
            return  CommentRepository.createComment(newComment)


            
        }else{
            return null
        }

    },

    async deleteCommentById(id:string, userId: string){
    
        return CommentRepository.deleteCommentById(id)
    },

    async updateCommentById(id: string, data: CommentUpdateModel){

        return CommentRepository.updateCommentById(id, data)
    }
}