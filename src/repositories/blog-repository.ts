import { ObjectId} from "mongodb"
import { db } from "../db/db"
import { BlogUpdateModel } from "../models/blogs/inputBlogsModels/BlogUpdateModel"
import { BlogDb } from "../blog/blog-db"
import { QueryPostBlogInputModel} from "../models/posts/inputPostsModel/query.post.input.model"
import { OutputPostType } from "../models/posts/outputPostsModel/post.output.model"
import { Pagination } from "../types/types"
import { postMapper } from "../mappers/postMapper"

export const BlogRepository = {

    async getBlogById(id: string): Promise<BlogDb | null> {
        const blog = await db.getCollections().blogsCollection.findOne({_id : new ObjectId(id)})

        if (!blog) {
            return null
        }

        return blog 
    },
    async createBlog(createData: BlogDb): Promise<string> {

            const res = await db.getCollections().blogsCollection.insertOne(createData)

            return res.insertedId.toString()

        
    },
    
    async updateBlog (id: string, updateData: BlogUpdateModel): Promise<boolean>{
        try{
            const res = await db.getCollections().blogsCollection.updateOne({_id : new ObjectId(id)}, {
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
            const res= await db.getCollections().blogsCollection.deleteOne({_id: new ObjectId(id)})
            
            return !!res.deletedCount
        }catch(e){
            return false}

        
    },

    async getPostByBlogId(blogId:string, data: QueryPostBlogInputModel): Promise<Pagination<OutputPostType>> {
        
        const sortData = {
            sortBy: data.sortBy ?? "createdAt",
            sortDirection: data.sortDirection ?? "desc",
            pageNumber: data.pageNumber ? +data.pageNumber : 1,
            pageSize: data.pageSize ? +data.pageSize : 10
        }

        const {sortBy, sortDirection, pageNumber, pageSize} = sortData
        
        const posts = await db.getCollections().postsCollection
            .find({blogId: blogId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await db.getCollections().postsCollection.countDocuments({blogId:blogId})
        const pagesCount = Math.ceil(totalCount / +pageSize)

            return {
                pageSize,
                page: pageNumber,
                pagesCount,
                totalCount,
                items: posts.map(postMapper)
            }
    },
}
