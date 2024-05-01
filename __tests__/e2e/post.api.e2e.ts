import request from 'supertest'
import { RouterPaths, app } from '../../src/settings'
import { HTTP_STATUSES } from '../../src/statuses'
import { PostCreateModel } from '../../src/models/posts/inputPostsModel/PostCreateModel'
import { postsTestManager } from './utils/postsTestManager'

const {OK_200,
    CREATED_201,
    NO_CONTENT_204,
    BAD_REQUEST_400,
    UNAUTHORIZED_401,
    NOT_FOUND_404} = HTTP_STATUSES

    export const authorizationValue = 'Basic YWRtaW46cXdlcnR5'
    const dropAuth = 'Bla BLA'
    

    let createdBlog2: any = {id: 123}    


    let createdPost1:any = null
    export const dataPost: PostCreateModel = {
        title: 'title1',
        shortDescription: 'shortDescription1',
        content: 'content1',
        blogId: createdBlog2.id,
    }

    describe('Testing posts',  () =>{

    //Очищаем БД
    beforeEach(async () => {
        await request(app)
        .delete(RouterPaths.test)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    //Проверяем, что БД пустая 
    it ('Get All Posts', async ()  => {
        await request(app)
        .get(RouterPaths.posts)
        .expect(HTTP_STATUSES.OK_200, [])
    })

    //Добавляем один пост
    it ('CreatePost', async() => {
        //TestManager, Сравнение
        
        const {createdPost} = await postsTestManager.createdPost(dataPost)
    
        createdPost1=createdPost

        //Запрашиваем все посты(должен быть один)
        await request(app)
        .get(RouterPaths.posts)
        .expect(HTTP_STATUSES.OK_200, [createdPost1])

        //Запрашиваем пост по ID
        await request(app)
        .get(`${RouterPaths.posts}/${createdPost1.id}`)
        .expect(HTTP_STATUSES.OK_200)
        

        //Запрашиваем пост по неверному  ID
        await request(app)
        .get(`${RouterPaths.posts}/-100`)
        .expect(HTTP_STATUSES.NOT_FOUND_404)
        })

    //Пытаемся добавить пост с неправильной AUTH 
    it ('UNAUTHORIZED', async () =>{
        await request(app)
        .post(RouterPaths.posts)
        .set('authorization', dropAuth)
        .send(dataPost)
        .expect(HTTP_STATUSES.UNAUTHORIZED_401)

    })

    //Пытаемся добавить пост с ошибками 
    it ('dropValue', async () =>{
        const dataPost: PostCreateModel = {
            title: 'qwertyqwertyqwertyqwertyqwerty',
            shortDescription: '',
            content: ' ',
            blogId: createdBlog2.id,
        }
        await request(app)
        .post(RouterPaths.posts)
        .set('authorization', authorizationValue)
        .send(dataPost)
        .expect(HTTP_STATUSES.BAD_REQUEST_400, {
            errorsMessages: [
            {message: 'Incorrect title!', field: 'title'},
            {message: 'Incorrect shortDescription!', field: 'shortDescription'},
            {message: 'Incorrect content!', field: 'content'},
            ]    
        })

    })
    
    //Изменяем пост по ID
    it ('CreatePost', async() => {
        //TestManager, Сравнение
        const {createdPost} = await postsTestManager.createdPost(dataPost)
    
        createdPost1=createdPost

        await request(app)
        .put(`${RouterPaths.posts}/${createdPost1.id}`)
        .set('authorization', authorizationValue)
        .send({
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
        })
        .expect(HTTP_STATUSES.NO_CONTENT_204)
    })    
    
    //Удаляем пост по ID
    it ('CreatePost', async() => {
        //TestManager, Сравнение
        const {createdPost} = await postsTestManager.createdPost(dataPost)
    
        createdPost1=createdPost
    
        await request(app)
        .delete(`${RouterPaths.posts}/${createdPost1.id}`)
        .set('authorization', authorizationValue)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
    
        //Проверяем что пост по ID удалился
        await request(app)
        .get(`${RouterPaths.posts}/${createdPost1.id}`)
        .expect(HTTP_STATUSES.NOT_FOUND_404)
        })
})