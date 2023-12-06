import { Router, Response, Request } from "express";
import { blogDb } from "../db/BlogsDb";
import { postDb } from "../db/PostsDb";

export const testRoute = Router({})

testRoute.delete('/', (req: Request, res: Response) => {
    blogDb.length = 0
    postDb.length = 0
    res.status(204).send("All data is deleted")
})