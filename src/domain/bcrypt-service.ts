import bcrypt from "bcrypt"

export const bcryptService = {

    // async _generateHash (password: string, salt: string){
    //     const hash = bcrypt.hash(password, salt)
    //     return hash
    // },
    

    async generateHash(pass:string){
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(pass, salt)
        // const passwordHash = await this._generateHash(pass, passwordSalt)

    },

    async checkPassword(password:string, hash:string) {
        return bcrypt.compare(password, hash)
    }
}