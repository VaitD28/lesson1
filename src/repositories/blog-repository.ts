import { ObjectId} from "mongodb"
import { blogsCollection } from "../db/db"
import { BlogUpdateModel } from "../models/blogs/inputBlogsModels/BlogUpdateModel"
import { OutputBlogType } from "../output/blog.output.models"
import { BlogDb } from "../blog/blog-db"

export const BlogRepository = {

    async getBlogById(id: string): Promise<BlogDb | null> {
        const blog = await blogsCollection.findOne({_id : new ObjectId(id)})

        if (!blog) {
            return null
        }

        return blog 
    },
    async createBlog(createData: OutputBlogType): Promise<string> {

            const res = await blogsCollection.insertOne(createData)

            return res.insertedId.toString()

        
    },
    
    async updateBlog (id: string, updateData: BlogUpdateModel): Promise<boolean>{
        try{
            const res = await blogsCollection.updateOne({_id : new ObjectId(id)}, {
                $set:{
                    name:updateData.name,
                    description:updateData.description,
                    websiteUrl:updateData.websiteUrl
                }
            })
    
            return !!res.matchedCount
        }catch(e){
            return false}
        
    },

    async deleteBlogById(id:string): Promise<boolean> {
        try{
            const res= await blogsCollection.deleteOne({_id: new ObjectId(id)})

            return !!res.deletedCount
        }catch(e){
            return false}
    

    }
}
