import { Request } from "express"
export type RequestWithParams<P> = Request<P, {}, {}, {}>      
export type RequestWithBody<B> = Request<{}, {}, B, {}>         
export type RequestWithParamsBody<P, B> = Request<P, {}, B, {}>  
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>

