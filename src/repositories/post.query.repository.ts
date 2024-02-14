import { OutputPostType } from "../output/post.output.model"
import { blogsCollection, postsCollection } from "../db/db"
import { postMapper } from "../mappers/postMapper"
import { ObjectId } from "mongodb"
import { QueryPostInputModel } from "../models/posts/inputPostsModel/query.post.input.model"
import { Pagination } from "../types/types"

export const PostQueryRepository = {
    async getAllPost(data: QueryPostInputModel): Promise<Pagination<OutputPostType>> {
        const sortData = {
            sortBy: data.sortBy ?? "createdAt",
            sortDirection: data.sortDirection ?? "desc",
            pageNumber: data.pageNumber ? +data.pageNumber : 1,
            pageSize: data.pageSize ?? 10
        }
        const {sortBy, sortDirection, pageNumber, pageSize} = sortData

        const posts = await postsCollection
            .find()
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .toArray()

            const totalCount = await postsCollection.countDocuments()
            const pagesCount = Math.ceil(totalCount / pageSize)
            return {
                pageSize,
                page: pageNumber,
                pagesCount,
                totalCount,
                items: posts.map(postMapper)
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

    async getPostByBlogId(blogId:string, data: QueryPostInputModel): Promise<Pagination<OutputPostType >| null> {
        
        const blog =await blogsCollection.findOne({_id : new ObjectId(blogId)})
        
        if (!blog){
            return null
        }
        
        const sortData = {
            sortBy: data.sortBy ?? "createdAt",
            sortDirection: data.sortDirection ?? "desc",
            pageNumber: data.pageNumber ? +data.pageNumber : 1,
            pageSize: data.pageSize ?? 10,
        }
        
        let filter ={}   
    
        const {sortBy, sortDirection, pageNumber, pageSize} = sortData
            
        if(blogId){
            filter = {
                blogId: {
                    $regex: blogId
                }
            }
        }
        const posts = await postsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount / pageSize)
            return {
                pageSize,
                page: pageNumber,
                pagesCount,
                totalCount,
                items: posts.map(postMapper)
            }
    },
}
