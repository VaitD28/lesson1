import request from 'supertest';
import { RouterPaths, app } from "../../../src/settings";
import { authorizationValue} from "../blogs.api.e2e";
import { PostCreateModel } from '../../../src/models/posts/inputPostsModel/PostCreateModel';
import { blogsTestManager } from './blogsTestManager';
import { BlogCreateModel } from '../../../src/models/blogs/inputBlogsModels/BlogCreateModel';
import { HTTPStatusType, HTTP_STATUSES } from '../../../src/statuses';


export const postsTestManager = {

    

    async createdPost(dataPost: PostCreateModel, expectStatusCode: HTTPStatusType= HTTP_STATUSES.CREATED_201){
            
        const data: BlogCreateModel = {
            name: "goodName",
            description: "goodDescription",
            websiteUrl: "https://ZuhaFQzkBwMFAn6MuZei8RV-g.SYTfKlrAP5A0qAfIdAWv86ngDF.Da9tQRhUvzQluNEGjhz8lqeO_1bon8oyN1tcnuF"
        }
        
        const response1 = await request(app)
        .post(RouterPaths.blogs)
        .set('authorization', authorizationValue)
        .send(data)
        .expect(expectStatusCode)

    let createdBlog

    if(expectStatusCode === HTTP_STATUSES.CREATED_201){
        createdBlog = response1.body
        expect (createdBlog).toEqual({
            id:expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            isMembership: false,
            createdAt: expect.any(String)
        })
    }
    
    const response = await request(app)
    .post(RouterPaths.posts)
    .set('authorization', authorizationValue)
    .send(dataPost)
    .expect(expectStatusCode)

    let createdPost
    console.log(1)
    if(expectStatusCode === HTTP_STATUSES.CREATED_201){
        createdPost = response.body
        expect (createdPost).toEqual({
            id:expect.any(String),
            title: dataPost.title,
            shortDescription: dataPost.shortDescription,
            content: dataPost.content,
            blogId: createdBlog.id,
            blogName: createdBlog.name,
            createdAt: expect.any(String)
        })
    }
    
    return { response, createdPost}}
    }

