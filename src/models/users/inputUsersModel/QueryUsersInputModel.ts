import { SortDirection } from "mongodb"

export type QueryUsersInputModel = {
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: number
    pageSize?: number
    searchLoginTerm?: string
    searchEmailTerm?: string
}