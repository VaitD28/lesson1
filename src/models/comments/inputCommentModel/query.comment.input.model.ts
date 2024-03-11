import { SortDirection } from "mongodb"

export type QueryPostCommentInputModel = {
    pageNumber?: number
    pageSize?: number    
    sortBy?: string
    sortDirection?: SortDirection
}