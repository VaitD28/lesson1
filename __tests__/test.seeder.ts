import { randomUUID } from "crypto";
import { add } from "date-fns/add";
import { UserDb } from "../src/user/UserDb";
import { db } from "../src/db/db";
type RegisterUserType = {
    login: string, 
    email: string,
    password: string,
    createdAt: string,
    code?: string,
    expirationDate? : Date,
    isConfirmed? : boolean
}

export const testSeeder = {
    createUserDto() {
        return {
            login: 'testing',
            email: 'test@gmail.com',
            password: '123456789'
        }
    },

    createUserDtos(count: number) {
        const users = new Array;

        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                password: '123456789'
            })
        }
        return users;
    },

    async registerUser(
        {
            login,
            email,
            password,
            code,
            expirationDate,
            isConfirmed
        }: RegisterUserType
    ): Promise<UserDb> {
        const newUser: UserDb = {
            login,
            email,
            passwordHash: password,
            createdAt: new Date().toISOString(),
            confirmationCode: code ?? randomUUID(),
            expirationDate: expirationDate ?? add(new Date(), {
                hours: 1,
                minutes: 30,
            }),
            isConfirmed: isConfirmed ?? false
        };
    

    const res = await db.getCollections().usersCollection.insertOne({...newUser})
    return {
        id: res.insertId.toString(),
        ...newUser
    }
}
}