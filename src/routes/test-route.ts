import { Router, Response, Request } from "express";

import { blogsCollection, postsCollection } from "../db/db";

export const testRoute = Router({})

testRoute.delete('/', async (req: Request, res: Response<{}>) => {

    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})

    res.status(204).send("All data is deleted")
})