import { emailManager } from "../../src/managers/email-manager";
import { UserDb } from "../../src/user/UserDb";
import { WithId } from "mongodb";

export const emailServiceMock: typeof emailManager = {
    async sendConfirmationCode(user: WithId<UserDb>){
        return true
    }
}