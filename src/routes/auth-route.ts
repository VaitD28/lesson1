import { Router, Response, Request} from "express";
import { UserService } from "../domain/user-service";
import { RequestWithBody } from "../types/types";
import { LoginModel } from "../middlewares/auth/LoginModel";
import { HTTP_STATUSES } from "../statuses";
import { userLogValidation, userPostValidation } from "../validators/users-validator";
import { jwtService } from "../application/jwt.service";
import { bearerAuthMiddleware } from "../middlewares/auth/bearer-auth";
import { RegistrationModel } from "../middlewares/auth/RegistrationModel";
import { authService } from "../domain/auth-service";
import { confirmModel } from "../middlewares/auth/confirmationModel";
import { resendingValidator } from "../validators/resending-validator";
import { resendingModel } from "../middlewares/auth/resendingModel";
import { UserRepository } from "../repositories/user-repository";
import { emailManager } from "../managers/email-manager";


export const authRoute = Router({})


authRoute.post('/login', userLogValidation, async (req: RequestWithBody<LoginModel>, res:Response) => {
    
    const checkUser = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)


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

authRoute.post('/registration', userPostValidation, async (req: RequestWithBody<RegistrationModel>, res:Response) => {

    const newUser = await authService.registerUser(req.body.login, req.body.email, req.body.password)

    if (!newUser){ 
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }


    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    
})

authRoute.post('/registration-confirmation', async (req: RequestWithBody<confirmModel>, res: Response) => {
    const confirm = await authService.confirmationCode(req.body.code)
    if (!confirm) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

})

authRoute.post ('/registration-email-resending', resendingValidator,  async (req: RequestWithBody<resendingModel>, res: Response) => {
    
    const user = await UserRepository.getUserByEmail(req.body.email)

    if (!user) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    emailManager.sendConfirmationCode(user)
    
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})