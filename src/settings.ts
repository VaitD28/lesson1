import express,  {Request, Response}  from 'express';
import { videoRoute } from './routes/video-router';
import { blogRoute } from './routes/blog-route';
import { postRoute } from './routes/post-route';
import { testRoute } from './routes/test-route';


export const app = express()
export const RouterPaths = {
    videos: '/videos',
    blogs: '/blogs',
    posts: '/posts',
    test: '/testing/all-data',
    // blogId: '/blogs/:id',
    // postId: '/posts/:id'
}
app.use(express.json())



app.use(RouterPaths.videos, videoRoute)
app.use(RouterPaths.blogs, blogRoute)
app.use(RouterPaths.posts, postRoute)
app.use(RouterPaths.test, testRoute)

