
import { WithId } from "mongodb";
import { BlogDb } from "../../../blog/blog-db";
import { OutputBlogType } from "./blog.output.models";

export const GetBlogViewModel = (blog: WithId<BlogDb>): OutputBlogType => {
    return {
        id : blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
    }
    