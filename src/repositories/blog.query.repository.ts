import { ObjectId} from "mongodb"
import { blogsCollection } from "../db/db"
import { blogMapper } from "../mappers/blogMapper"
import { OutputBlogType } from "../models/blogs/outputBlogsModels/blog.output.models"
import { QueryBlogInputModel } from "../models/blogs/inputBlogsModels/query.blog.input.model"
import { Pagination } from "../types/types"

export const BlogQueryRepository = {
    async getAllBlogs(data: QueryBlogInputModel): Promise<Pagination<OutputBlogType>> {
        const sortData = {
            searchNameTerm: data.searchNameTerm ?? null,
            sortBy: data.sortBy ?? "createdAt",
            sortDirection: data.sortDirection ?? "desc",
            pageNumber: data.pageNumber ? +data.pageNumber : 1,
            pageSize: data.pageSize ? +data.pageSize : 10
        }
    
        let filter ={}
        const {sortBy, sortDirection, pageNumber, pageSize} = sortData

        if (sortData.searchNameTerm){
            filter = {
                name: {
                    $regex: sortData.searchNameTerm,
                    $options: 'i'
                }
            }
        }
        console.log(filter)
        
            const blogs = await blogsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .toArray()

            const totalCount = await blogsCollection.countDocuments(filter)
            const pagesCount = Math.ceil(totalCount / +pageSize)
            return {
                pageSize,
                page: pageNumber,
                pagesCount,
                totalCount,
                items: blogs.map(blogMapper)
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
        
    }
}