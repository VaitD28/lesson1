export type OutputUserDb = {
    id:string,
    login:string,
    email: string,
    passwordHash: string,
    createdAt: string,
    confirmationCode: string,
    expirationDate: Date ,
    isConfirmed: boolean 
}
