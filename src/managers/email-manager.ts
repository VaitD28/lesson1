import { WithId } from "mongodb";
import { emailAdapter } from "../adapters/email-adapter";
import { UserDb } from "../user/UserDb";

export const emailManager = {
    async sendConfirmationCode(newUser: WithId<UserDb>){
        const code = await emailAdapter.sendConfirmationCode(
            newUser.email,
            "Thank for your registration",
            `<div>To finish registration please follow the link below: <a href='https://somesite.com/confirm-email?code=${newUser.confirmationCode}'>complete registration</a></div>`)
            
            // 'https://somesite.com/confirm-email?code="your_confirmation_code"'
        return true    
    } 
}                       


