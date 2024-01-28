import { Router, Response, Request } from 'express'
import { BlogRepository } from '../repositories/blog-repository'
import { RequestWithBody, RequestWithParams, RequestWithParamsBody } from '../types/types'
import { authMiddleware } from '../middlewares/auth/auth-middleware'
import { URIParamsBlogsModel } from '../models/blogs/inputBlogsModels/URIParamsBlogModel'
import { blogPostValidation } from '../validators/blogs-validator'
import { BlogCreateModel } from '../models/blogs/inputBlogsModels/BlogCreateModel'
import { HTTP_STATUSES } from '../statuses'
import { OutputBlogType } from '../output/blog.output.models'
import { ObjectId } from 'mongodb'
import { BlogUpdateModel } from '../models/blogs/inputBlogsModels/BlogUpdateModel'


export const blogRoute = Router({})

blogRoute.get('/', async (req: Request, res: Response)  => {
    const blogs = await BlogRepository.getAllBlogs()
    
    res.send(blogs)
})

blogRoute.get('/:id', async (req: RequestWithParams<URIParamsBlogsModel>, res: Response)  => {
    const id = req.params.id
    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    
    const blog = await BlogRepository.getBlogById(id)
    if (blog){
        res.status(HTTP_STATUSES.OK_200).send(blog)
    }else{
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

}
);

blogRoute.post('/', authMiddleware, blogPostValidation, async (req: RequestWithBody<BlogCreateModel>, res: Response<OutputBlogType | boolean>)  => {
    
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const newBlog: OutputBlogType = {
        id: new Date().toISOString(),
        name,
        description,
        websiteUrl,
        isMembership: false,
        createdAt: new Date().toISOString()
    }

    const createBlogId = await BlogRepository.createBlog(newBlog)

    const blog = await BlogRepository.getBlogById(createBlogId)

    if (!blog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    
    res.status(HTTP_STATUSES.CREATED_201).send(blog)
})

blogRoute.put('/:id', authMiddleware, blogPostValidation, async (req: RequestWithParamsBody<URIParamsBlogsModel, BlogUpdateModel>, res: Response)  => {
    const id =  req.params.id
    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const blog = await BlogRepository.getBlogById(id)

    if(!blog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const isBlogUpdated = await BlogRepository.updateBlog(id, {name, description, websiteUrl})

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

blogRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsBlogsModel>, res: Response) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const isDeleted = await BlogRepository.deleteBlogById(id)

    if(!isDeleted){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
