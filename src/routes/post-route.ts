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


export const postRoute = Router({})

postRoute.get('/', (req: Request, res: Response) => {
    const posts = postRepository.getAllPost()
    res.send(posts)
})

postRoute.get('/:id', (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const id = req.params.id
    const post = postRepository.getPostById(id)

    if (!post){
        res.sendStatus(404)
    }
    res.send(post)
})

postRoute.post('/', authMiddleware, postPostValidation, (req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel>) => {
    let {title, shortDescription, content, blogId} = req.body
    const newPost = postRepository.createPost(title, shortDescription, content, blogId)
    if (!newPost){
        res.sendStatus(404)
    }
    res.status(201).send(GetPostViewModel(newPost))
})

postRoute.put('/id', authMiddleware, postPostValidation, (req: RequestWithParamsBody<URIParamsPostModel, PostUpdateModel>, res: Response) =>{
    let {title, shortDescription, content, blogId} = req.body
    const id = req.params.id
    const updatePost = postRepository .updatePostById(id, {title, shortDescription, content, blogId})
    if(!updatePost){
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

postRoute.delete('/:id',authMiddleware, (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const id = req.params.id
    let post = postRepository.deletePostById(id)
    
    if (!post) {
        res.sendStatus(404)
        return
    }
        res.sendStatus(204)
})



