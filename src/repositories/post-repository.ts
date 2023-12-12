import { BlogType, blogDb } from "../db/BlogsDb"
import { PostType, postDb } from "../db/PostsDb"

import { BlogRepository } from "./blog-repository"
import { PostUpdateModel } from "../features/posts/models/inputPostsModel/PostUpdateModel"
import { GetPostViewModel } from "../features/posts/models/outputPostsModel/GetPostViewModel"

export const postRepository = {
    getAllPost() {
        return postDb.map(GetPostViewModel)
    },

    getPostById(id:string) {
        return postDb.find((post: PostType) => post.id === id)
    },

    createPost(title:string, shortDescription:string, content:string, blogId:string): PostType {
        
        const blog = BlogRepository.getBlogById(blogId)
        const newPost = {
            id: (+new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name
        }

        postDb.push(newPost)

        return newPost
    },

    // updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        updatePostById(postId: string, updateData: PostUpdateModel) {
        let post = postDb.find((post: PostType)=> post.id === postId)
        if (!post){
            return false
        }else{
        post.title = updateData.title,
        post.shortDescription = updateData.shortDescription,
        post.content = updateData.content,
        post.blogId = updateData.blogId

        return true
        }

    },

    deletePostById(id:string) {
        let post= postDb.findIndex(post => post.id === id)
        if (post == -1){
            return null
        }
        return true 
        blogDb.splice(post, 1)
        return post
    }


}