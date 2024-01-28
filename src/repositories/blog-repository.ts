import { ObjectId} from "mongodb"
import { blogsCollection } from "../db/db"
import { BlogUpdateModel } from "../models/blogs/inputBlogsModels/BlogUpdateModel"
import { blogMapper } from "../mappers/blogMapper"
import { OutputBlogType } from "../output/blog.output.models"

export const BlogRepository = {
    async getAllBlogs(): Promise<OutputBlogType[]| boolean> {
        try{
            const blogs = await blogsCollection.find({}).toArray()

            return blogs.map(blogMapper)
        }catch(e){
            return false
        }
    },

    async getBlogById(id: string): Promise<OutputBlogType | null> {
        try{
            const blog = await blogsCollection.findOne({_id : new ObjectId(id)})

            if (!blog) {
                return null
            }

        return blogMapper(blog)
        }catch(e){
            return null
            }
        
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
