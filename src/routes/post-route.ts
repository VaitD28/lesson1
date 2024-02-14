import { Router, Response } from 'express'
import { Pagination, RequestWithBody, RequestWithParams, RequestWithParamsBody, RequestWithQuery } from '../types/types'
import { authMiddleware } from '../middlewares/auth/auth-middleware'
import { postPostValidation } from '../validators/post-validator'
import { PostCreateModel } from '../models/posts/inputPostsModel/PostCreateModel'
import { URIParamsPostModel } from '../models/posts/inputPostsModel/URIParamsPostModel'
import { PostUpdateModel } from '../models/posts/inputPostsModel/PostUpdateModel'
import { HTTP_STATUSES } from '../statuses'
import { OutputPostType } from '../output/post.output.model'
import { ObjectId } from 'mongodb'
import { PostService } from '../domain/post-service'
import { PostQueryRepository } from '../repositories/post.query.repository'
import { QueryPostInputModel } from '../models/posts/inputPostsModel/query.post.input.model'

export const postRoute = Router({})

postRoute.get('/', async (req: RequestWithQuery<QueryPostInputModel>, res: Response<Pagination<OutputPostType>>) => {

    const posts = await PostQueryRepository.getAllPost(req.query)

    res.send(posts)
})

postRoute.get('/:id', async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const id = req.params.id
    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    const post = await PostQueryRepository.getPostById(id)

    if (post){
        res.status(HTTP_STATUSES.OK_200).send(post)
    }else{
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
})

postRoute.post('/', authMiddleware, postPostValidation, async (req: RequestWithBody<PostCreateModel>, res: Response<OutputPostType>) => {
    const createData = req.body
    const postId = await PostService.createPost(createData)
    
    if (postId){
        const newPost = await PostQueryRepository.getPostById(postId)
        if(!newPost){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    }
})


postRoute.put('/:id', authMiddleware, postPostValidation, async (req: RequestWithParamsBody<URIParamsPostModel, PostUpdateModel>, res: Response) =>{
    const id = req.params.id

    if(!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId

    const post = await PostQueryRepository.getPostById(id) 

    if(!post){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const updatePost = await PostService.updatePost(id, {title, shortDescription, content, blogId})
    
    if (updatePost){
    res.status(HTTP_STATUSES.NO_CONTENT_204).send(updatePost)
    }

})

postRoute.delete('/:id',authMiddleware, async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const id = req.params.id  
    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    let post = await PostService.deletePostById(id)
    
    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})



