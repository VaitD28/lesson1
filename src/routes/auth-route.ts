import { Router, Response} from "express";
import { UserService } from "../domain/user-service";
import { RequestWithBody } from "../types/types";
import { LoginModel } from "../middlewares/auth/LoginModel";
import { HTTP_STATUSES } from "../statuses";


export const authRoute = Router({})


authRoute.post('/login', async (req: RequestWithBody<LoginModel>, res:Response) => {
    
    const checkUser = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!checkUser){
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})