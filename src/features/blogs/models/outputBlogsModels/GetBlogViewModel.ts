
import { BlogType } from "../../../../db/BlogsDb";
import { BlogViewModel } from "./BlogViewModel";

export const GetBlogViewModel = (blog : BlogType): BlogViewModel =>{
return{
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl
}
}