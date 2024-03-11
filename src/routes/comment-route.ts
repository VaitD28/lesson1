import { Router, Request, Response } from "express";
import { RequestWithParams, RequestWithParamsBody } from "../types/types";
import { URIParamsCommentModel } from "../models/comments/inputCommentModel/URIParamsCommentModel";
import { ObjectId } from "mongodb";
import { HTTP_STATUSES } from "../statuses";
import { CommentQueryRepository } from "../repositories/comment.query.repository";
import { bearerAuthMiddleware } from "../middlewares/auth/bearer-auth";
import { CommentRepository } from "../repositories/comment-repository";
import { checkCommentAccess } from "../middlewares/checkCommentAccess";
import {CommentUpdateModel} from "../models/comments/inputCommentModel/CommentUpdateModel"
import { commentsValidator } from "../validators/comments-validator";
import { CommentService } from "../domain/comment-service";
export const commentRoute = Router({})

commentRoute.get('/:id',  async (req: RequestWithParams<URIParamsCommentModel>,  res: Response) => {
    
    const id = req.params.id

    if (!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const comment = await CommentQueryRepository.getCommentById(id)

    if(!comment){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.status(HTTP_STATUSES.OK_200).send(comment)
})

commentRoute.delete('/:id', bearerAuthMiddleware, checkCommentAccess, async (req: Request, res: Response) =>{
    const id = req.params.id
    
    const idDeleted = await CommentRepository.deleteCommentById(id)
    
    if(!idDeleted){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

commentRoute.put('/:id', bearerAuthMiddleware, checkCommentAccess, commentsValidator, async (req: RequestWithParamsBody<URIParamsCommentModel, CommentUpdateModel>, res: Response) => {

const commentId = req.params.id
const data = req.body
const updateComment = await CommentService.updateCommentById(commentId, data )
if(!updateComment){
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return
}

res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})