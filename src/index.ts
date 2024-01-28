import {port, runDb } from './db/db';
import {app} from './settings';

app.listen(port, async()  => {
    await runDb()
    
})

// export type ErrorsMessages = {
//     message: string;
//     field: string;
// };

// export type ErrorType = {                                      
//     errorsMessages: ErrorsMessages[]
// }