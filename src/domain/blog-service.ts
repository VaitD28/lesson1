import { BlogDb } from "../blog/blog-db"
import { BlogCreateModel } from "../models/blogs/inputBlogsModels/BlogCreateModel"
import { BlogUpdateModel } from "../models/blogs/inputBlogsModels/BlogUpdateModel"
import { OutputBlogType } from "../output/blog.output.models"
import { BlogRepository } from "../repositories/blog-repository"

export const BlogService = {

    async getBlogById(id: string): Promise<BlogDb | null> {
        return BlogRepository.getBlogById(id)

    },
    

    async createBlog(createData: BlogCreateModel): Promise<string> {

        const name = createData.name
        const description = createData.description
        const websiteUrl = createData.websiteUrl
    
        const newBlog: OutputBlogType = {
            id: new Date().toISOString(),
            name,
            description,
            websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()
        }
        
        return BlogRepository.createBlog(newBlog)

        
    },
    
    async updateBlog (id: string, updateData: BlogUpdateModel): Promise<boolean>{
        
        const name = updateData.name
        const description = updateData.description
        const websiteUrl = updateData.websiteUrl

        return BlogRepository.updateBlog(id, updateData)
        
    },

    async deleteBlogById(id:string): Promise<boolean> {
    
        return BlogRepository.deleteBlogById(id)
    

    },

}
