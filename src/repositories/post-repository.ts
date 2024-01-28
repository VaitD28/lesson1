import { postDb } from "../db/PostsDb"
import { PostUpdateModel } from "../models/posts/inputPostsModel/PostUpdateModel"
import { OutputPostType } from "../output/post.output.model"
import { blogsCollection, postsCollection } from "../db/db"
import { postMapper } from "../mappers/postMapper"
import { PostCreateModel } from "../models/posts/inputPostsModel/PostCreateModel"
import { BlogRepository } from "./blog-repository"
import { PostDb } from "../post/post-db"
import { ObjectId } from "mongodb"

export const PostRepository = {
    async getAllPost(): Promise<OutputPostType[]| boolean> {
        try{
            const posts = await postsCollection.find({}).toArray()

            return posts.map(postMapper)
            }
            catch(e){
                return false
            }
        
    },

    async getPostById(id:string): Promise<OutputPostType | null> {
        try{
            const post =await postsCollection.findOne({_id : new ObjectId(id)})
        
            if (!post){
                return null
            }

        return postMapper(post)
    }catch(e){
        return null
    }
    },

    async createPost(data: PostCreateModel) {
        const createdAt = new Date()
        const blog = await BlogRepository.getBlogById(data.blogId)
        if (blog){
            const newPost: PostDb = {
                ...data,
                blogName: blog.name,
                createdAt: createdAt.toISOString()
            }
            const result = await postsCollection.insertOne(newPost)
            return result.insertedId.toString()
        }else{
            return null
        }


    },

    async updatePost(id: string, updateData: PostUpdateModel): Promise<boolean> {

        const res = await postsCollection.updateOne({_id : new ObjectId(id)}, {
            $set:{
                title: updateData.title,
                shortDescription: updateData.shortDescription,
                content: updateData.content,
                blogId: updateData.blogId
            }
        })

        return !!res.matchedCount

    },

    async deletePostById(id:string): Promise<boolean> {
        const res= await postsCollection.deleteOne({_id: new ObjectId(id)})

        
        return !!res.deletedCount
    }

}