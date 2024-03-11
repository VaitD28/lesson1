import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../application/jwt.service";
import { UserService } from "../../domain/user-service";
import { HTTP_STATUSES } from "../../statuses";

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)

    if(!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    req.user = await UserService.getUserById(userId.toString())
    console.log(1)
    next() 

    
}
