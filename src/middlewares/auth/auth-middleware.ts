import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../application/jwt.service";
import { UserService } from "../../domain/user-service";
import { HTTP_STATUSES } from "../../statuses";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers.authorization

    if (auth === 'Basic YWRtaW46cXdlcnR5'){
        return next()
    }else{
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
}

