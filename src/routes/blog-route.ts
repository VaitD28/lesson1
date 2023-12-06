import { Router, Response, Request } from 'express'
import { BlogRepository } from '../repositories/blog-repository'
import { RequestWithBody, RequestWithParams, RequestWithParamsBody } from '../types/types'
import { authMiddleware } from '../middlewares/auth/auth-middleware'
import { URIParamsBlogsModel } from '../features/blogs/models/inputBlogsModels/URIParamsBlogModel'
import { blogPostValidation } from '../validators/blogs-validator'
import { BlogCreateModel } from '../features/blogs/models/inputBlogsModels/BlogCreateModel'
import { BlogUpdateModel } from '../features/blogs/models/inputBlogsModels/BlogUpdateModel'
import { BlogViewModel } from '../features/blogs/models/outputBlogsModels/BlogViewModel'
import { BlogType, blogDb } from '../db/BlogsDb'
import { GetBlogViewModel } from '../features/blogs/models/outputBlogsModels/GetBlogViewModel'
import { HTTP_STATUSES } from '../statuses'


export const blogRoute = Router({})

blogRoute.get('/', (req: Request, res: Response<BlogViewModel[]>)  => {
    const blogs = BlogRepository.getAllBlogs()
    
    res.send(blogs)
})

blogRoute.get('/:id', (req: RequestWithParams<URIParamsBlogsModel>, res: Response<BlogViewModel>)  => {
    const foundBlog = BlogRepository.getBlogById(req.params.id)
    if (!foundBlog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
        res.send(GetBlogViewModel(foundBlog));
    
}
);

blogRoute.post('/', authMiddleware, blogPostValidation,  (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>)  => {
    let{name, description, websiteUrl} = req.body
    
    const newBlog = BlogRepository.postBlog(name, description, websiteUrl)

    
    if (!newBlog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.status(HTTP_STATUSES.CREATED_201).send(GetBlogViewModel(newBlog))
})

blogRoute.put('/:id', authMiddleware, blogPostValidation,  (req: RequestWithParamsBody<URIParamsBlogsModel, BlogUpdateModel>, res: Response)  => {

    let { name, description, websiteUrl} = req.body

    const id = req.params.id

    const foundBlog = BlogRepository.putBlogById(id, name, description, websiteUrl)

    if(!foundBlog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

blogRoute.delete('/:id', authMiddleware, (req: RequestWithParams<URIParamsBlogsModel>, res: Response) => {
    const id = req.params.id
    let blog = BlogRepository.deleteBlogById(id)

    if(!blog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
