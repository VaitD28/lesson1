import { MongoMemoryServer } from "mongodb-memory-server"
import { db } from "../../src/db/db"

describe('Users e2e', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })



    describe('User Registration', () => {
        
        beforeEach(async () => {
            await db.drop();
        })

        //Проверяем, что БД пустая
    it ('Get All Blogs', async ()  => {
        await request(app)
        .get(RouterPaths.users)
        .expect(HTTP_STATUSES.OK_200, [])
    })

        it ('should register user' )
    })


})