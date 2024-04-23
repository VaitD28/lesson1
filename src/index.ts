import {appConfig, db} from './db/db';
import {app} from './settings';

// app.listen(port, async()  => {
//     await runDb()
    
// })

app.listen(appConfig.port, async()  => {
await db.run(appConfig.url)
})