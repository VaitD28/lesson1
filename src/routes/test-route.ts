import { Router, Response, Request } from "express";

import { blogsCollection, postsCollection } from "../db/db";
import { HTTP_STATUSES } from "../statuses";

export const testRoute = Router({})

testRoute.delete('/', async (req: Request, res: Response<{}>) => {

    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})

    res.status(HTTP_STATUSES.NO_CONTENT_204).send("All data is deleted")
})