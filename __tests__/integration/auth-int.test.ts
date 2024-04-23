import { MongoMemoryServer } from "mongodb-memory-server";
import { appConfig, db} from "../../src/db/db";
import { authService } from "../../src/domain/auth-service";
import { emailManager } from "../../src/managers/email-manager";


describe('AUTH-INTEGRATION', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        const URL = mongoServer.getUri()
        appConfig.url = URL
    })

    beforeEach(async () => {
        await db.drop();
    })

    afterAll (async () => {
        await db.drop();
        await db.stop();
    })

    afterAll ((done) => done())
   
    describe('User Registration', async () => { 
        const registerUserUseCase = authService.registerUser;

        //emailManager.sendConfirmationCode = emailServiceMock.sendConfirmationCode;      
        //emailManager.sendConfirmationCode = jest.fn()   Простая функция, ничего не принимает и не возвращает  

        emailManager.sendConfirmationCode = jest.fn().mockImplementation()    
    })

    
})