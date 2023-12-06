import express,  {Request, Response}  from 'express';
import { videoRoute } from './routes/video-router';
import { blogRoute } from './routes/blog-route';
import { postRoute } from './routes/post-route';
import { testRoute } from './routes/test-route';


export const app = express()
app.use(express.json())

app.use('/videos', videoRoute)
app.use('/blogs', blogRoute)
app.use('/posts', postRoute)
app.use('/testing/all-data', testRoute)
