import { Request } from "express"
export type RequestType = Request<{}, {}, {}, {}>
export type RequestWithParams<P> = Request<P, {}, {}, {}>      
export type RequestWithBody<B> = Request<{}, {}, B, {}>         
export type RequestWithParamsBody<P, B> = Request<P, {}, B, {}>  
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithQueryParams<P, Q> = Request<P, {}, {}, Q>




export type Pagination<I> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: I[]
}