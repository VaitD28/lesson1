import { WithId } from "mongodb"
import { CommentDb } from "../comment/comment-db"
import { OutputCommentType } from "../models/comments/outputCommentModel/comment.output.models"

export const commentMapper = (comment: WithId<CommentDb>): OutputCommentType => {
return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
    },
    createdAt: comment.createdAt
}
}
