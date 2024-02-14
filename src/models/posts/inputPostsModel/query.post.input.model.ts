import { SortDirection } from "mongodb"

export type QueryPostBlogInputModel = {
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: number
    pageSize?: number
}