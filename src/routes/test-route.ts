import { Router, Response, Request } from "express";

import { db } from "../db/db";
import { HTTP_STATUSES } from "../statuses";

export const testRoute = Router({})

testRoute.delete('/', async (req: Request, res: Response<{}>) => {

    const drop = await db.drop()

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})