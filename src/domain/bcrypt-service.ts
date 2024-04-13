import bcrypt from "bcrypt"

export const bcryptService = {

    async _generateHash (password: string, salt: string){
        const hash = bcrypt.hash(password, salt)
        return hash
    },
    

    async generateHash(pass:string){
        const passwordSalt = await bcrypt.genSalt(10)

        const passwordHash = await this._generateHash(pass, passwordSalt)

    }
}