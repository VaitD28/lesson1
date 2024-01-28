import request from 'supertest'
import { app } from '../../src/settings'
import { HTTP_STATUSES } from '../../src/statuses'
const {OK_200,
    CREATED_201,
    NO_CONTENT_204,
    BAD_REQUEST_400,
    UNAUTHORIZED_401,
    NOT_FOUND_404} = HTTP_STATUSES
describe('Testing blogs',  () =>{
    const auth = 'YWRtaW46cXdlcnR5'

    it ('Create blog && Get all blogs', async () => {
        const response = await request(app).get('/blogs')
        .set('Authorization', `Basic ${auth}`)
        .send({
            name: 'name1',
            description: 'description1',
            websiteUrl: 'https://-.CnM2Ro3WV8_Ry8IpPp6S6qsxSD9L-09_d1qEYzlI-I.8ynHc3AR3u7zvcXLykIvMBHEXKF_zNUTPXuf2pIotPE5xbk'
        })

        expect.setState({body: response.body} )

        const blogs = await request(app).get('/blogs')

        expect(blogs.status).toBe(OK_200)
    })
})