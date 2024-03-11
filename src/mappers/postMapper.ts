import { WithId } from "mongodb"
import { OutputPostType } from "../models/posts/outputPostsModel/post.output.model"
import { PostDb } from "../post/post-db"

export const postMapper = (post: WithId<PostDb>): OutputPostType => {
return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt
}
}
