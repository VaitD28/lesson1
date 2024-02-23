
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { BlogDb } from '../blog/blog-db'
import { PostDb } from '../post/post-db'
import { UserDb } from '../user/UserDb'

dotenv.config()

export const port = 80
const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017"
const client = new MongoClient(mongoURI)

const database = client.db('BlogPostDb')

export const blogsCollection = database.collection<BlogDb>('blogs')
export const postsCollection = database.collection<PostDb>('posts')
export const usersCollection = database.collection<UserDb>('users')

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
