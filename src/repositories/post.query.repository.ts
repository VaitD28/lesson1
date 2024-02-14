import { OutputPostType } from "../output/post.output.model"
import { postsCollection } from "../db/db"
import { postMapper } from "../mappers/postMapper"
import { ObjectId } from "mongodb"
import { QueryPostBlogInputModel } from "../models/posts/inputPostsModel/query.post.input.model"
import { Pagination } from "../types/types"

export const PostQueryRepository = {
    async getAllPost(sortData: QueryPostBlogInputModel): Promise<Pagination<OutputPostType>> {

            const sortBy = sortData.sortBy ?? "createdAt"
            const sortDirection= sortData.sortDirection ?? "desc"
            const pageNumber=  sortData.pageNumber ?? 1
            const pageSize= sortData.pageSize ?? 10
        
        
        const posts = await postsCollection
            .find({})
            .sort(sortBy, sortDirection)
            .skip((pageNumber-1)*pageSize)
            .limit(pageSize)
            .toArray()

            const totalCount = await postsCollection.countDocuments({})
            const pagesCount = Math.ceil(totalCount / +pageSize)
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


}
