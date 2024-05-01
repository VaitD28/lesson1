import { ObjectId } from "mongodb"

export type TokenDb = {
    userId: ObjectId,
    tokens: string[]
};

export type TokenUpdateModel = {
    token: string
}