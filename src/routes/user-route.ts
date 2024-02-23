import { Router, Response, Request } from "express"
import { UserService } from "../domain/user-service"
import { HTTP_STATUSES } from "../statuses"
import { Pagination, RequestWithBody, RequestWithParams, RequestWithQuery } from "../types/types"
import { QueryUsersInputModel } from "../models/users/inputUsersModel/QueryUsersInputModel"
import { OutputUserType } from "../models/users/outputUserModel.ts/OutputUserModel"
import { userPostValidation } from "../validators/users-validator"
import { UserCreateModel } from "../models/users/inputUsersModel/UserCreateModel"
import { URIParamsUsersModel } from "../models/users/inputUsersModel/URIParamsUsersModel"
import { ObjectId } from "mongodb"


export const userRoute = Router({})

userRoute.get('/', async (req: RequestWithQuery<QueryUsersInputModel>, res: Response<Pagination<OutputUserType>>) =>{
    
    const allUsers = await UserService.getAllUsers(req.query)

    res.status(HTTP_STATUSES.OK_200).send(allUsers)
})

userRoute.post('/', userPostValidation, async (req: RequestWithBody<UserCreateModel>, res:Response) => {

    const newUser = await UserService.createUser(req.body) 

    if (!newUser){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    
    const user = await UserService.getUserById(newUser)

    if (!user){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    
    res.status(HTTP_STATUSES.CREATED_201).send(user)
})

userRoute.delete('/:id', async (req: RequestWithParams<URIParamsUsersModel>, res: Response) => {
    
    const id = req.params.id

    if(!ObjectId.isValid(id)){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const isDeleted = await UserService.deleteUserById(id)

    if(!isDeleted){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})