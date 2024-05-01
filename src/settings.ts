import express,  {Request, Response}  from 'express';
import { videoRoute } from './routes/video-router';
import { blogRoute } from './routes/blog-route';
import { postRoute } from './routes/post-route';
import { testRoute } from './routes/test-route';
import { userRoute } from './routes/user-route';
import { authRoute } from './routes/auth-route';
import { commentRoute } from './routes/comment-route';
import cookieParser from 'cookie-parser';


export const app = express()
export const RouterPaths = {
    videos: '/videos',
    blogs: '/blogs',
    posts: '/posts',
    test: '/testing/all-data',
    users: '/users',
    auth: '/auth',
    comments: '/comments'
}
app.use(express.json())
app.use(cookieParser())


app.use(RouterPaths.videos, videoRoute)
app.use(RouterPaths.blogs, blogRoute)
app.use(RouterPaths.posts, postRoute)
app.use(RouterPaths.test, testRoute)
app.use(RouterPaths.users, userRoute)
app.use(RouterPaths.auth, authRoute)
app.use(RouterPaths.comments, commentRoute)