import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendConfirmationCode(email: string, subject: string, message: string){
        let transport = nodemailer.createTransport({
            host: "gmail",
            auth: {
                user: "dmitrysamurit@gmail.com",
                pass: "qzel mugx hbqa mtlq",
            },
        });

        let info = await transport.sendMail({
            from: 'Back <dmitrysamurit@gmail.com>',
            to: email,
            subject: subject,
            text: message
        });


    }
}