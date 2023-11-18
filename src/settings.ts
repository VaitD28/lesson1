import express,  {Request, Response}  from 'express';
import { title } from 'process';

export const app = express()


app.use(express.json())

type RequestWithParams<P> = Request<P, {}, {}, {}>       // Типизируем Params
type RequestWithBody<B> = Request<{}, {}, B, {}>         // Типизируем Body
type RequestWithParamsBody<P, B> = Request<P, {}, B, {}>         // Типизируем Body
type ErrorsMessages = {                                  // Типизируем ERRORS Messages
    message: string
    field: string
}
type ErrorType = {                                       // Типизируем ERRORS
    errorsMessages: ErrorsMessages[]
}

enum AvailableResolutions {                              // Типизируем AvailableResolutions
    P144='P144',
    P240='P240',
    P360='P360',
    P480='P480',
    P720='P720', 
    P1080='P1080',
    P1440='P1440',
    P2160='P2160'
}

type VideoType = {                                      // Типизируем Video 
    id: number  
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string 
    availableResolutions: AvailableResolutions[]

}
let videoDb: VideoType[] = [                          // База данных Видео
    { 
        id: 0, 
        title: "string", 
        author: "string", 
        canBeDownloaded: false, 
        minAgeRestriction: null, 
        createdAt: "2023-10-18T10:11:43.720Z", 
        publicationDate: "2023-10-18T10:11:43.720Z", 
        availableResolutions: [ 
        AvailableResolutions.P144 
        ] 
    }    
]

app.get('/videos', (req: Request, res: Response) => {        //Запрос на раздел видео
    res.send(videoDb)
})

app.get('/videos/:id',  (req: RequestWithParams<{id: number}>, res: Response) =>{          //Запрос видео по ID
    const id = +req.params.id

    const video = videoDb.find((video) => video.id === id)

    if (!video){                                                                            //Ошибка при неверном ID
        res.sendStatus(404)
        return
    }

    res.status(200).send(video)
})

app.post('/videos', (req:RequestWithBody<{                                                  //Запрос на отправку данных Body
        title: "string", 
        author: "string", 
        availableResolutions: AvailableResolutions[]
}>, res:Response) => {

    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body

    if(!title || !title.length || title.trim().length > 40){
            errors.errorsMessages.push({message: 'Invalid title', field: 'title'})
    }

    if(!author || !author.length || author.trim().length > 20){
        errors.errorsMessages.push({message: 'Invalid author', field: 'author'})
    }
    
    if(Array.isArray(availableResolutions) && availableResolutions.length){ 
        const isValid = availableResolutions.every(el => Object.values(AvailableResolutions).includes(el)) 
            if(!isValid){
                errors.errorsMessages.push({
                message: 'Invalid availableResolutions', 
                field: 'availableResolutions' 
            })
        } 
    } 
        
    if (errors.errorsMessages.length){  //Вывод ошибки при наличии ошибок
        res.status(400).send(errors)
        return
    } 

    const createdAt : Date = new Date()
    const publicationDate :Date = new Date()

    publicationDate.setDate(createdAt.getDate() + 1)

        const newVideo: VideoType = {
            id: +(new Date()),
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
            title,
            author,
            availableResolutions
        } 

        videoDb.push(newVideo)

        res.status(201).send(newVideo)
})

app.delete('/videos', (req: Request, res: Response) => {        //Запрос на удаление всех видео
    videoDb.length = 0
    res.sendStatus(204)
    return
})

app.delete('/videos/:id',  (req: RequestWithParams<{id: number}>, res: Response) =>{          //Удаление видео по ID
        const id = +req.params.id
        let i= videoDb.findIndex(video => video.id === id)
        console.log(i)
        if(i==-1){
            res.send(404)
            }else{
        videoDb.splice(i, 1)
        res.sendStatus(204)
        return;
    }
    })

app.put('/videos/:id', (req: RequestWithParamsBody<{id: number}, {                                           
    title: string, 
    author: string, 
    availableResolutions: AvailableResolutions[],
    canBeDownloaded: boolean,
    minAgeRestriction: number,
    publicationDate: string
}>,  res: Response) => {  

    const id = +req.params.id
    const video = videoDb.find((video) => video.id === id)


    if(video){
        const errors: ErrorType = {
            errorsMessages: []
        }

        const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
        
        
        if (!title || !title.trim() || title.length > 40 || typeof title !== 'string' ) {
            errors.errorsMessages.push({message: 'Incorrect title', field: 'title'})
        }

        if (!author || !author.trim() || author.length > 20){
            errors.errorsMessages.push({message: 'Incorrect author', field: 'author'})
        }

        if(Array.isArray(availableResolutions) && availableResolutions.length){
            const isValid = availableResolutions.every(el => Object.values(AvailableResolutions).includes(el)) 
            if(!isValid){
                errors.errorsMessages.push({
                    message: 'Incorrect availableResolutions', 
                    field: 'availableResolutions' 
                })
            }
        }

        if (typeof canBeDownloaded !== 'undefined' && typeof canBeDownloaded !== 'boolean'){               //&&
            errors.errorsMessages.push({
                message: 'Incorrect canBeDownloaded', 
                field: 'canBeDownloaded' 
            })
            
        }

        if (!minAgeRestriction  || typeof minAgeRestriction !== 'number' || minAgeRestriction > 18 || minAgeRestriction < 1){            //>18
            errors.errorsMessages.push({
                message: 'Incorrect minAgeRestriction', 
                field: 'minAgeRestriction' 
            })
            
        }

        if (!publicationDate || typeof publicationDate !== 'string'){                  // ==?
            errors.errorsMessages.push({
                message: 'Incorrect publicationDate', 
                field: 'publicationDate' 
            })
        } 

        if (errors.errorsMessages.length){
            console.log(errors)
            res.status(400).send(errors)
        } else {
            
            video.availableResolutions = availableResolutions;
            video.minAgeRestriction = minAgeRestriction;
            video.canBeDownloaded = canBeDownloaded || false;
            video.publicationDate = publicationDate;
            video.title = title;
            video.author = author;

            res.sendStatus(204)
        }
    } else { 
        res.sendStatus(404)
    }
})


app.delete('/__test__/data', (req: Request, res: Response) => {        //Запрос на удаление всех видео
    videoDb.length = 0
    res.sendStatus(204)
    return
})