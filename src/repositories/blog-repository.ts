import { BlogType, blogDb } from "../db/BlogsDb"
import { GetBlogViewModel } from "../features/blogs/models/outputBlogsModels/GetBlogViewModel"


export const BlogRepository = {
    getAllBlogs() {
        return blogDb.map(GetBlogViewModel)
    },

    getBlogById(id: string) {
        return blogDb.find((blog: BlogType) => blog.id === id)
    },

    postBlog(name: string, description: string, websiteUrl: string) : BlogType{
        
        const newBlog = {
                id: (+new Date()).toString(),
                name,
                description,
                websiteUrl
        } 
        
            blogDb.push(newBlog)

        return newBlog;
    
    },


    putBlogById(id: string, name: string, description: string, websiteUrl: string){
        
        const blog = blogDb.find((blogs) => blogs.id === id)
        
        if (!blog){
            return false
        }else{
        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl

        return true
        }
    },

    deleteBlogById(id:string){
    let blog = blogDb.findIndex(b => b.id === id)

    if (blog==-1){
        return null
    }

    return true

    blogDb.splice(blog, 1)
    
        return blog
    }  

}
