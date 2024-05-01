
import dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import { BlogDb } from '../blog/blog-db'
import { PostDb } from '../post/post-db'
import { UserDb } from '../user/UserDb'
import {CommentDb} from '../comment/comment-db'  
import {TokenDb} from '../token/token-db'  
dotenv.config()

export const appConfig = {
port : 80,
JWT_SECRET_ACC : process.env.JWT_SECRET_ACC || "123",
JWT_SECRET_REF : process.env.JWT_SECRET_ACC || "124",
url : process.env.MONGO_URL || "mongodb://0.0.0.0:27017",
accessTokenLife: 10,
refreshTokenLife: 20
}

// export const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017"


// const client = new MongoClient(mongoURI)

//const database = client.db('BlogPostDb')

// export const blogsCollection = database.collection<BlogDb>('blogs')
// export const postsCollection = database.collection<PostDb>('posts')
// export const usersCollection = database.collection<UserDb>('users')
// export const commentsCollection = database.collection<CommentDb>('comments')

// export const runDb = async() => {
//     try{
//         await client.connect()
//         console.log('Client connected to DB')
//         console.log(`Example app listening on port ${port}`)
//     }catch (e){
//         console.log('Can`t connect to db')

//         await client.close()

//     }
// }


export const db = {
    client: {} as MongoClient,

    getDbName(): Db {
        return this.client.db('BlogPostDb');
    },

    async run(url: string){
        try{
            this.client = new MongoClient(url)

            await this.client.connect();
            console.log('client', this.client)
            await this.getDbName().command({ping: 1});
            console.log('Connected successfully to mongo server');
        }catch(e: unknown){
            console.error('Can`t connect to mongo server', e);

            await this.client.close();
        }
    },

    async stop() {

        await this.client.close();
        console.log('Connection successful closed');
    },

    async drop() {
        try{
            const collections = await this.getDbName().listCollections().toArray();
            
            for (const collection of collections){
                const collectionName = collection.name;
                await this.getDbName().collection(collectionName).deleteMany({});
                console.log('All data is deleted')
            }
        }catch(e: unknown){
            console.error('Error in drop db:', e);
            await this.stop();
        }
    },
    getCollections(){
        return {
            blogsCollection : this.getDbName().collection<BlogDb>('blogs'),
            postsCollection : this.getDbName().collection<PostDb>('posts'),
            usersCollection: this.getDbName().collection<UserDb>('users'),
            commentsCollection : this.getDbName().collection<CommentDb>('comments'),
            tokenBlackListCollection : this.getDbName().collection<TokenDb>('token')

        }
    }
}