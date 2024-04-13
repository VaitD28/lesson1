export type UserDb = {
    login:string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string
    confirmationCode: string
    // confirmationCodeExpirationDate: string
    isConfirmed: boolean 
}