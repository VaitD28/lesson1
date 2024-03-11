import { WithId } from "mongodb";
import { BlogDb } from "../blog/blog-db";
import { OutputBlogType } from "../models/blogs/outputBlogsModels/blog.output.models";

export const blogMapper = (blog: WithId<BlogDb>): OutputBlogType => {
    return {
    id : blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
    createdAt: blog.createdAt
    }
}
