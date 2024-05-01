import { Router, Response, Request} from "express";
import { UserService } from "../domain/user-service";
import { RequestWithBody } from "../types/types";
import { LoginModel } from "../middlewares/auth/LoginModel";
import { HTTP_STATUSES } from "../statuses";
import { userLogValidation, userPostValidation } from "../validators/users-validator";
import { confirmCodeValidation } from "../validators/confirmCode-validator";
import { jwtService } from "../application/jwt.service";
import { bearerAuthMiddleware } from "../middlewares/auth/bearer-auth";
import { RegistrationModel } from "../middlewares/auth/RegistrationModel";
import { authService } from "../domain/auth-service";
import { confirmModel } from "../middlewares/auth/confirmationModel";
import { resendingValidator } from "../validators/resending-validator";
import { resendingModel } from "../middlewares/auth/resendingModel";
import { ResultStatus } from "../common/types/resultCode";
import { appConfig } from "../db/db";
import { UserRepository } from "../repositories/user-repository";



export const authRoute = Router({})


authRoute.post('/login', userLogValidation, async (req: RequestWithBody<LoginModel>, res:Response) => {

    const checkUser = await UserService.checkCredentials(req.body.loginOrEmail, req.body.password)


    if (checkUser){
        
    const accessToken = await jwtService.CreateJWT(checkUser, appConfig.accessTokenLife, appConfig.JWT_SECRET_ACC)

    const refreshToken = await jwtService.CreateJWT(checkUser, appConfig.refreshTokenLife, appConfig.JWT_SECRET_REF)

    const accToken = {
        "accessToken": accessToken
    }

    res.cookie('refreshToken', refreshToken, {httpOnly: true,secure: true})
    res.status(HTTP_STATUSES.OK_200).send(accToken)
    return

    }else{
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
})

authRoute.get('/me', bearerAuthMiddleware, async (req: Request, res: Response) => {
    // const user = {
    //     "email": req.user!.email,
    //     "login": req.user!.login,
    //     "userId": req.user!.id
    // }  
    
    // res.status(HTTP_STATUSES.OK_200).send(user)
    const token = req.cookies.accessToken
    const userId = await jwtService.getUserIdByACCToken(token)
    const user = await UserRepository.getUserById(userId)

    const userInf = {
        "email": user!.email,
        "login": user!.login,
        "userId": userId
    }

    return res.status(HTTP_STATUSES.OK_200).send(userInf)
})

authRoute.post('/registration', userPostValidation, async (req: RequestWithBody<RegistrationModel>, res:Response) => {
    console.log(req.body.login, req.body.email, req.body.password, 'dataReg')
    const result = await authService.registerUser(req.body.login, req.body.email, req.body.password)
    
    if (result.status === ResultStatus.Success) {
        
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    
    }else{
        
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorMessage)
    }
    
})

authRoute.post('/registration-confirmation', confirmCodeValidation, async (req: RequestWithBody<confirmModel>, res: Response) => {
    const result = await authService.confirmationCode(req.body.code)
    
    if (result.status === ResultStatus.Success) {
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    
    }else{
        
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorMessage)
    }
})

authRoute.post ('/registration-email-resending', resendingValidator,  async (req: RequestWithBody<resendingModel>, res: Response) => {
    
    const result = await authService.resendingCode(req.body.email)
    
    if (result.status === ResultStatus.Success) {
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    
    }else{
        
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result.errorMessage)
    }
})

authRoute.post ('/refresh-token', async (req: Request , res: Response) => {

    const refreshToken = req.cookies.refreshToken
  
    const tokens = await authService.updateToken(refreshToken)
    console.log(tokens)
    if (!tokens){
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }

    const accToken = tokens.accToken
    const newRefreshToken = tokens.newRefreshToken

        res.cookie('refreshToken', newRefreshToken, {httpOnly: true,secure: true})
        res.status(HTTP_STATUSES.OK_200).send(accToken)
        return
})

authRoute.post ('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const token = await authService.TokenInBlackList(refreshToken)
    if (!token) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }else{
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
})