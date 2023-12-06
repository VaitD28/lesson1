import {app} from './settings';

const port =  process.env.PORT ?? 4444

app.listen(port, ()  => {
    console.log(`App starter on ${port} port`)
    
})

export type ErrorsMessages = {
    message: string;
    field: string;
};

export type ErrorType = {                                      
    errorsMessages: ErrorsMessages[]
}