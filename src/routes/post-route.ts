import { Router, Response } from 'express'
import { Pagination, RequestWithBody, RequestWithParams, RequestWithParamsBody, RequestWithQuery, RequestWithQueryParams } from '../types/types'
import { authMiddleware } from '../middlewares/auth/auth-middleware'
import { postPostValidation } from '../validators/post-validator'
import { PostCreateModel } from '../models/posts/inputPostsModel/PostCreateModel'
import { URIParamsPostModel } from '../models/posts/inputPostsModel/URIParamsPostModel'
import { PostUpdateModel } from '../models/posts/inputPostsModel/PostUpdateModel'
import { HTTP_STATUSES } from '../statuses'
import { OutputPostType } from '../models/posts/outputPostsModel/post.output.model'
import { ObjectId } from 'mongodb'
import { PostService } from '../domain/post-service'
import { PostQueryRepository } from '../repositories/post.query.repository'
import { QueryPostBlogInputModel } from '../models/posts/inputPostsModel/query.post.input.model'
import { bearerAuthMiddleware } from '../middlewares/auth/bearer-auth'
import { CommentPostModel } from '../models/comments/inputCommentModel/CommentsInputModel'
import { CommentService } from '../domain/comment-service'
import { commentsValidator } from '../validators/comments-validator'
import { CommentQueryRepository } from '../repositories/comment.query.repository'
import { CommentRepository } from '../repositories/comment-repository'
import { QueryPostCommentInputModel } from '../models/comments/inputCommentModel/query.comment.input.model'

export const postRoute = Router({})

postRoute.get('/', async (req: RequestWithQuery<QueryPostBlogInputModel>, res: Response<Pagination<OutputPostType>>) => {
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize
    }
    const posts = await PostQueryRepository.getAllPost(sortData)

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
    return
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

postRoute.post('/:id/comments', bearerAuthMiddleware, commentsValidator, async (req: RequestWithParamsBody<URIParamsPostModel, CommentPostModel>, res: Response) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        console.log(1)
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    console.log(1)
    const content = req.body.content
    const userData = req.user
    const newComment = await CommentService.createComment(id, content, userData!)
    if (!newComment){
        res.sendStatus (HTTP_STATUSES.NOT_FOUND_404)
        return
    }else{
        const comment = await CommentQueryRepository.getCommentById(newComment)
        if (!comment){
            res.sendStatus (HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUSES.CREATED_201).send(comment)
    }
} )

postRoute.get('/:id/comments', async (req: RequestWithQueryParams<{id:string}, QueryPostCommentInputModel>, res: Response) => {

    const postId = req.params.id
    
    const data = req.query

    if(!ObjectId.isValid(postId)){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const post = await PostQueryRepository.getPostById(postId)

    if(!post){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const comments = await CommentQueryRepository.getCommentsByPostId(postId, data)

    res.status(HTTP_STATUSES.OK_200).send(comments)

})