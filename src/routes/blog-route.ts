import { Router, Response} from 'express'
import { Pagination, RequestWithBody, RequestWithParams, RequestWithParamsBody, RequestWithQuery, RequestWithQueryParams } from '../types/types'
import { authMiddleware } from '../middlewares/auth/auth-middleware'
import { URIParamsBlogsModel } from '../models/blogs/inputBlogsModels/URIParamsBlogModel'
import { blogPostValidation } from '../validators/blogs-validator'
import { BlogCreateModel } from '../models/blogs/inputBlogsModels/BlogCreateModel'
import { OutputBlogType } from '../output/blog.output.models'
import { ObjectId } from 'mongodb'
import { BlogUpdateModel } from '../models/blogs/inputBlogsModels/BlogUpdateModel'
import { BlogService } from '../domain/blog-service'
import { HTTP_STATUSES } from '../statuses'
import { QueryBlogInputModel } from '../models/blogs/inputBlogsModels/query.blog.input.model'
import { createPostFromBlogValidation } from '../validators/post-validator'
import { CreatePostFromBlogInputModels } from '../models/blogs/inputBlogsModels/create.post.from.blog.input.models'
import { PostService } from '../domain/post-service'
import { BlogQueryRepository } from '../repositories/blog.query.repository'
import { BlogRepository } from '../repositories/blog-repository'
import { PostDb } from '../post/post-db'
import { PostQueryRepository } from '../repositories/post.query.repository'
import { BlogDb } from '../blog/blog-db'
import { OutputPostType } from '../output/post.output.model'
import { QueryPostInputModel } from '../models/posts/inputPostsModel/query.post.input.model'


export const blogRoute = Router({})

blogRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModel>, res: Response<Pagination<OutputBlogType>>)  => {

    const blogs = await BlogQueryRepository.getAllBlogs(req.query)
    
    res.status(HTTP_STATUSES.OK_200).send(blogs)
})

blogRoute.get('/:id', async (req: RequestWithParams<URIParamsBlogsModel>, res: Response)  => {
    const id = req.params.id
    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const blog = await BlogQueryRepository.getBlogById(id)
    if (blog){
        res.status(HTTP_STATUSES.OK_200).send(blog)
    }else{
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

}
);

blogRoute.get('/:id/posts', async (req: RequestWithQueryParams<{id: string}, QueryPostInputModel>, res: Response)  => {
    const blogId = req.params.id
    if (!ObjectId.isValid(blogId)){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const blog = await BlogQueryRepository.getBlogById(blogId)
    if (!blog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
        const posts = await PostQueryRepository.getPostByBlogId(blogId, req.query)
        
        res.status(HTTP_STATUSES.OK_200).send(posts)
    }


);

blogRoute.post('/', authMiddleware, blogPostValidation, async (req: RequestWithBody<BlogCreateModel>, res: Response)  => {
    
    const createBlogId = await BlogService.createBlog(req.body)
    if (!createBlogId){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    const blog = await BlogQueryRepository.getBlogById(createBlogId)

    if (!blog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    
    res.status(HTTP_STATUSES.CREATED_201).send(blog)
})

blogRoute.post('/:id/posts', authMiddleware, createPostFromBlogValidation, async (req: RequestWithParamsBody<URIParamsBlogsModel, CreatePostFromBlogInputModels>, res: Response)  => {
    const id = req.params.id
    const {title, content, shortDescription} = req.body
    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const blog = await BlogRepository.getBlogById(id)

    if (!blog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const newPost: PostDb = {
        title,
        content,
        shortDescription,
        blogId: id,
        blogName: blog.name,
        createdAt: new Date().toISOString()
    }
    const createPostId = await PostService.createPost(newPost)
    if (!createPostId){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const post = await PostQueryRepository.getPostById(createPostId)
    if (!post){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    res.status(HTTP_STATUSES.CREATED_201).send(post)
})

blogRoute.put('/:id', authMiddleware, blogPostValidation, async (req: RequestWithParamsBody<URIParamsBlogsModel, BlogUpdateModel>, res: Response)  => {
    const id =  req.params.id
    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const blog = await BlogService.getBlogById(id)

    if(!blog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const isBlogUpdated = await BlogService.updateBlog(id, req.body)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsBlogsModel>, res: Response) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const isDeleted = await BlogService.deleteBlogById(id)

    if(!isDeleted){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
