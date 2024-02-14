import request from 'supertest';
import { BlogCreateModel } from "../../../src/models/blogs/inputBlogsModels/BlogCreateModel";
import { RouterPaths, app } from "../../../src/settings";
import { authorizationValue} from "../blogs.api.e2e";
import { HTTPStatusType, HTTP_STATUSES } from '../../../src/statuses';



export const blogsTestManager = {
    async createBlog(data: BlogCreateModel, expectStatusCode: HTTPStatusType= HTTP_STATUSES.CREATED_201){
        const response = await request(app)
        .post(RouterPaths.blogs)
        .set('authorization', authorizationValue)
        .send(data)
        .expect(expectStatusCode)

    let createdBlog

    if(expectStatusCode === HTTP_STATUSES.CREATED_201){
        createdBlog = response.body
        expect (createdBlog).toEqual({
            id:expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            isMembership: false,
            createdAt: expect.any(String)
        })
    }
    
    return {response, createdBlog}
    } 

}  