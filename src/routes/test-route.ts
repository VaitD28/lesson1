import { Router, Response, Request } from "express";

import { blogsCollection, postsCollection, usersCollection } from "../db/db";
import { HTTP_STATUSES } from "../statuses";

export const testRoute = Router({})

testRoute.delete('/', async (req: Request, res: Response<{}>) => {

    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})

    res.status(HTTP_STATUSES.NO_CONTENT_204).send("All data is deleted")
})