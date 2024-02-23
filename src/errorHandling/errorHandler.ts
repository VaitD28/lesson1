import { ErrorsMessages, ErrorsMessagesForLogin } from "./customErrors";

export const errorHandler = ({msg, path}: any): ErrorsMessages => {
return {
    message: msg,
    field: path
}
}

export type ErrorType = {                                      
    errorsMessages: ErrorsMessages[]
}

export const errorHandlerForLogin = ({msg}: any): ErrorsMessagesForLogin => {
    return {
        message: msg
    }
    }