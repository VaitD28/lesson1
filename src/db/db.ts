
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { BlogDb } from '../blog/blog-db'
import { PostDb } from '../post/post-db'

dotenv.config()

export const port = 80
const mongoURI = 'mongodb+srv://dimavoitkevich:CR7rz%24QLxrU3d76@vait98.pszrstu.mongodb.net/BloggerPlatformBack' || process.env.MONGO_URL
const client = new MongoClient(mongoURI)

const database = client.db('blogs-db')

export const blogsCollection = database.collection<BlogDb>('blogs')
export const postsCollection = database.collection<PostDb>('posts')

export const runDb = async() => {
    try{
        await client.connect()
        console.log('Client connected to DB')
        console.log(`Example app listening on port ${port}`)
    }catch (e){
        console.log('Can`t connect to db')

        await client.close()

    }
}
