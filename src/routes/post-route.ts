import { Router, Request, Response } from 'express'


import { RequestWithBody, RequestWithParams, RequestWithParamsBody } from '../types/types'
import { authMiddleware } from '../middlewares/auth/auth-middleware'
import { postPostValidation } from '../validators/post-validator'
import { PostCreateModel } from '../features/posts/models/inputPostsModel/PostCreateModel'
import { PostViewModel } from '../features/posts/models/outputPostsModel/PostViewModel'
import { postRepository } from '../repositories/post-repository'
import { QueryParamsPostModel } from '../features/posts/models/inputPostsModel/QueryParamsPostModel'
import { URIParamsPostModel } from '../features/posts/models/inputPostsModel/URIParamsPostModel'
import { PostUpdateModel } from '../features/posts/models/inputPostsModel/PostUpdateModel'
import { GetPostViewModel } from '../features/posts/models/outputPostsModel/GetPostViewModel'
import { HTTP_STATUSES } from '../statuses'


export const postRoute = Router({})

postRoute.get('/', (req: Request, res: Response<PostViewModel[]>) => {
    const posts = postRepository.getAllPost()
    res.send(posts)
})

postRoute.get('/:id', (req: RequestWithParams<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const foundPost = postRepository.getPostById(req.params.id)
    if (!foundPost){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.send(GetPostViewModel(foundPost))
})

postRoute.post('/', authMiddleware, postPostValidation, (req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel>) => {
    let {title, shortDescription, content, blogId} = req.body
    const newPost = postRepository.createPost(title, shortDescription, content, blogId)
    if (!newPost){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.status(HTTP_STATUSES.CREATED_201).send(GetPostViewModel(newPost))
})

postRoute.put('/id', authMiddleware, postPostValidation, (req: RequestWithParamsBody<URIParamsPostModel, PostUpdateModel>, res: Response) =>{
    let {title, shortDescription, content, blogId} = req.body
    const id = req.params.id
    const updatePost = postRepository.updatePostById(id, {title, shortDescription, content, blogId})
    if(!updatePost){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

postRoute.delete('/:id',authMiddleware, (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const id = req.params.id
    let post = postRepository.deletePostById(id)
    
    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})



