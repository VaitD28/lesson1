import { ErrorsMessages } from "./customErrors";

export const errorHandler = ({msg, path}: any): ErrorsMessages => {
return {
    message: msg,
    field: path
}
}

// export type ErrorType = {                                      
//     errorsMessages: ErrorsMessages[]
// }