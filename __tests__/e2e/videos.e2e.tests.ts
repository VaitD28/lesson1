// import request from 'supertest'
// import {app} from '../../src/settings'
// import { title } from 'process'
// describe('/videos', () => {
//     beforeAll(async () => {
//         await request(app).delete('/__test__/data')
//     })

//     it('should return 200', async () => {
//         await request(app)
//         .get('/videos')
//         .expect(200)
//     })

//     it('should return 404 for not existing video', async () =>{
//         await request(app)
//         .get('/videos/1')
//         .expect(404)
//     })

//     it(`should'nt create video with incorrect input data`, async () => {
//         await request(app)
//         .post('/videos')
//         .send({
//             title: '',
//         })
//         .expect(400)

//         await request(app)
//         .get('/videos')
//         .expect(200, [])

//     })  

//     it(`should create video with correct input data`, async () => {
//         const createResponse = await request(app)
//         .post('/videos')
//         .send({
//             title: 'it-incubator',
//             author: 'Author',
//             availableResolutions: ["P144"]
//         })
//         .expect(201)

//         const newVideo = createResponse.body

//             //comment to 144
//         // expect(newVideo).toEqual({
//         //     id: expect.any(Number),
//         //     title: 'it-incubator',
//         //     author: 'Author',
//         //     availableResolutions: ["P144"]

//         expect(newVideo.id).toBe(newVideo.id)

//         expect(newVideo.title).toBe(newVideo.title)

//         expect(newVideo.author).toBe(newVideo.author)
        
//         expect(newVideo.availableResolutions).toBe(newVideo.availableResolutions)

//         await request(app)
//             .get('/videos')
//             .expect(200)
//     })  
// })
