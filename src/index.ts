import {app} from './settings';

const port =  process.env.PORT ?? 4444

app.listen(port, ()  => {
    console.log(`App starter on ${port} port`)
    
})