import { WithId } from "mongodb";
import { emailAdapter } from "../adapters/email-adapter";
import { UserDb } from "../user/UserDb";

export const emailManager = {
    async sendConfirmationCode(newUser: UserDb){
        const code = await emailAdapter.sendConfirmationCode(newUser.email, "Thank for your registration", `To finish registration please follow the link below: https://somesite.com/confirm-email?code=${newUser.confirmationCode}`)

    } 
}