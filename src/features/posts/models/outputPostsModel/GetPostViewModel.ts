import { PostType } from "../../../../db/PostsDb"
import { PostViewModel } from "./PostViewModel"


export const GetPostViewModel = (post: PostType): PostViewModel => {
    return{
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName
    }
}

