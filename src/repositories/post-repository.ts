import { PostUpdateModel } from "../models/posts/inputPostsModel/PostUpdateModel"
import { postsCollection } from "../db/db"
import { PostDb } from "../post/post-db"
import { ObjectId } from "mongodb"

export const PostRepository = {

    async createPost(newPost: PostDb) {
        const result = await postsCollection.insertOne(newPost)
        return result.insertedId.toString()
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
        try{
            const res= await postsCollection.deleteOne({_id: new ObjectId(id)})
            
            return !!res.deletedCount
        }catch(e){
            return false}
    }

}