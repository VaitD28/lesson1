import { Router, Response, Request} from "express";
import { UserService } from "../domain/user-service";
import { RequestWithBody } from "../types/types";
import { LoginModel } from "../middlewares/auth/LoginModel";
import { HTTP_STATUSES } from "../statuses";
import { userLogValidation } from "../validators/users-validator";
import { jwtService } from "../application/jwt.service";
import { bearerAuthMiddleware } from "../middlewares/auth/bearer-auth";


export const authRoute = Router({})


authRoute.post('/login', userLogValidation, async (req: RequestWithBody<LoginModel>, res:Response) => {
    
    const checkUser = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)
    console.log(checkUser)

    if (checkUser){
        
    const token = await jwtService.CreateJWT(checkUser)

    const accessToken = {
        "accessToken": token 
    }

    res.status(HTTP_STATUSES.OK_200).send(accessToken)

    }else{
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
})

authRoute.get('/me', bearerAuthMiddleware, async (req: Request, res: Response) => {
    const user = {
        "email": req.user!.email,
        "login": req.user!.login,
        "userId": req.user!.id
    }  
    
    res.status(HTTP_STATUSES.OK_200).send(user)


})