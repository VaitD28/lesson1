import { MongoMemoryServer } from "mongodb-memory-server";
import { appConfig, db} from "../../src/db/db";
import { authService } from "../../src/domain/auth-service";
import { emailManager } from "../../src/managers/email-manager";
import { UserDb } from "../../src/user/UserDb";
import { testSeeder } from "../test.seeder";
import { ResultStatus } from "../../src/common/types/resultCode";
import { ObjectId, WithId } from "mongodb";


describe('AUTH-INTEGRATION', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })

    beforeEach(async () => {
        await db.drop();
    })

    afterAll (async () => {
        await db.drop();
        await db.stop();
    })

    afterAll ((done) => done())

    describe('User Registration', () => { 
        const registerUserUseCase = authService.registerUser;

        //emailManager.sendConfirmationCode = emailServiceMock.sendConfirmationCode;      
        //emailManager.sendConfirmationCode = jest.fn()   Простая функция, ничего не принимает и не возвращает  

        emailManager.sendConfirmationCode = jest.fn().mockImplementation((newUser: WithId<UserDb>) => {
            return true 
        })
        
        it.skip('should register user with correct data', async () => {
            const {login, email, password} = testSeeder.createUserDto()

            const result = await registerUserUseCase(login, email, password)

            expect(result.status).toBe(ResultStatus.Success)

            expect(result.data).toEqual({
            _id: expect.any(ObjectId),
            login,
            email,
            passwordHash: expect.any(String),
            createdAt: expect.any(String),
            confirmationCode: expect.any(String),
            expirationDate: expect.any(Date),
            isConfirmed: false
            })

            expect(emailManager.sendConfirmationCode).toBeCalled()
            expect(emailManager.sendConfirmationCode).toBeCalledTimes(1)
        })
    })

    describe('registration-email-resending', async () => { 
        const {login, email, password} = testSeeder.createUserDto()
        const code = 'qwerty'
        await testSeeder.registerUser({login, email, password, code})

        const emailResending = authService.resendingCode

        emailManager.sendConfirmationCode = jest.fn().mockImplementation((newUser: WithId<UserDb>) => {
            return true 
        })

        it('should send email with new code if user exists but not confirmed yet', async () =>{
            const {email} = testSeeder.createUserDto()

            const result = await emailResending(email)

            expect (result.status).toBe(ResultStatus.Success)

            expect (result.data.confirmationCode).toBe(!code)

        })

        
    })
    
})