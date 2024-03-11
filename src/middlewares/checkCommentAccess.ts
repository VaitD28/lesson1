import { NextFunction, Request, Response } from "express"
import { CommentQueryRepository } from "../repositories/comment.query.repository"
import { ObjectId } from "mongodb"
import { HTTP_STATUSES } from "../statuses"

export const checkCommentAccess = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id
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
    if(comment.commentatorInfo.userId===userId){
        return next()
    }else{
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
        return
        }
}