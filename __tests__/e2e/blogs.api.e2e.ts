import request from 'supertest'
import { RouterPaths, app } from '../../src/settings'
import { HTTP_STATUSES } from '../../src/statuses'
import { BlogCreateModel } from '../../src/models/blogs/inputBlogsModels/BlogCreateModel'
import { blogsTestManager } from './utils/blogsTestManager'
const {OK_200,
    CREATED_201,
    NO_CONTENT_204,
    BAD_REQUEST_400,
    UNAUTHORIZED_401,
    NOT_FOUND_404} = HTTP_STATUSES

    export const authorizationValue = 'Basic YWRtaW46cXdlcnR5'
    const dropAuth = 'Bla BLA'

    export const data: BlogCreateModel = {
            name: "goodName",
            description: "goodDescription",
            websiteUrl: "https://ZuhaFQzkBwMFAn6MuZei8RV-g.SYTfKlrAP5A0qAfIdAWv86ngDF.Da9tQRhUvzQluNEGjhz8lqeO_1bon8oyN1tcnuF"
    }

    describe('Testing blogs',  () =>{

    //Очищаем БД
    beforeEach(async () => {
        await request(app)
        .delete(RouterPaths.test)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    //Проверяем, что БД пустая
    it ('Get All Blogs', async ()  => {
        await request(app)
        .get(RouterPaths.blogs)
        .expect(HTTP_STATUSES.OK_200, [])
    })
    
    let createdBlog1: any = null

    //Добавляем один блог
    it ('CreateBlog', async() => {
        //TestManager, Сравнение
        const {createdBlog} = await blogsTestManager.createBlog(data)
    
        createdBlog1=createdBlog

        //Запрашиваем все блоги(должен быть один)
        await request(app)
        .get(RouterPaths.blogs)
        .expect(HTTP_STATUSES.OK_200, [createdBlog1])

        // expect(blogs.body.length).toBe(1)
        
    
        //Запрашиваем блог по ID
        await request(app)
        .get(`${RouterPaths.blogs}/${createdBlog1.id}`)
        .expect(HTTP_STATUSES.OK_200)
        

        //Запрашиваем блог по неверному  ID
        await request(app)
        .get(`${RouterPaths.blogs}/-100`)
        .expect(HTTP_STATUSES.NOT_FOUND_404)
        })

    //Пытаемся добавить блог с неправильной AUTH 
    it ('UNAUTHORIZED', async () =>{
        await request(app)
        .post(RouterPaths.blogs)
        .set('authorization', dropAuth)
        .send(data)
        .expect(HTTP_STATUSES.UNAUTHORIZED_401)

    })

    //Пытаемся добавить блог с ошибками 
    it ('dropValue', async () =>{
        const data: BlogCreateModel = {
            name: '12345678901234567890',
            description: ' ',
            websiteUrl: 'https://ZuhaFQzkBwMFAn6MuZei8RVlrAP5A0qAfIdAWv86ngUvzQluNEGjhzyN1tcnuF'
        }
        await request(app)
        .post(RouterPaths.blogs)
        .set('authorization', authorizationValue)
        .send(data)
        .expect(HTTP_STATUSES.BAD_REQUEST_400, {
            errorsMessages: [
            {message: 'Incorrect name!', field: 'name'},
            {message: 'Incorrect description!', field: 'description'},
            {message: 'Incorrect websiteUrl!', field: 'websiteUrl'},
            ]    
        })

    })
    
    //Изменяем блог по ID
    it ('putBlog', async () => {
        const {createdBlog} = await blogsTestManager.createBlog(data)
        
        createdBlog1=createdBlog

        await request(app)
        .put(`${RouterPaths.blogs}/${createdBlog1.id}`)
        .set('authorization', authorizationValue)
        .send({
            name: "goodName1",
            description: "goodDescription1",
            websiteUrl: "https://ZhaFQzkBwMFAn6MuZei8RV-g.SYTfKlrAP5A0qAfIdAWv86ngDF.Da9tQRhUvzQluNEGjhz8lqeO_1bon8oyN1tcnuF",
        })
        .expect(HTTP_STATUSES.NO_CONTENT_204)
    })    
    
    //Удаляем блог по ID
    it ('deleteById', async () => {
        const {createdBlog} = await blogsTestManager.createBlog(data)
        
        createdBlog1=createdBlog
    
        await request(app)
        .delete(`${RouterPaths.blogs}/${createdBlog1.id}`)
        .set('authorization', authorizationValue)
        .expect(HTTP_STATUSES.NO_CONTENT_204)
    
        //Проверяем что блог по ID удалился
        await request(app)
        .get(`${RouterPaths.blogs}/${createdBlog1.id}`)
        .expect(HTTP_STATUSES.NOT_FOUND_404)
        })
})