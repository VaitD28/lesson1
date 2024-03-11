import { CommentDb } from "../comment/comment-db"
import { PostCreateModel } from "../models/posts/inputPostsModel/PostCreateModel"
import { PostUpdateModel } from "../models/posts/inputPostsModel/PostUpdateModel"
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel"
import { PostDb } from "../post/post-db"
import { BlogRepository } from "../repositories/blog-repository"
import { PostRepository } from "../repositories/post-repository"
import { PostQueryRepository } from "../repositories/post.query.repository"

export const PostService = {

    async createPost(data: PostCreateModel) {

        const createdAt = new Date()
        const blog = await BlogRepository.getBlogById(data.blogId)
        if (blog){
            const newPost: PostDb = {
                ...data,
                blogName: blog.name,
                createdAt: createdAt.toISOString()
            }
    
            return PostRepository.createPost(newPost)
        
        }else{
            return null
        }


    },

    async updatePost(id: string, updateData: PostUpdateModel): Promise<boolean> {

        return PostRepository.updatePost(id, updateData)
    },

    async deletePostById(id:string): Promise<boolean> {

        return PostRepository.deletePostById(id)
    }

}