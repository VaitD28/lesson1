export type UserDb = {
    login:string,
    email: string,
    passwordHash: string,
    createdAt: string
    confirmationCode: string
    // confirmationCodeExpirationDate: string
    isConfirmed: boolean 
}