import { Router, Response, Request } from 'express'
import { AvailableResolutions, VideoType } from '../types/video/output'
import { RequestWithParams, RequestWithBody, ErrorType, RequestWithParamsBody } from '../types/types'
import { CreateVideoDto, UpdateVideoDto } from '../types/video/input'
import { videoDb } from '../db/VideoDb'


export const videoRoute = Router({})

videoRoute.get('/videos', (req: Request, res: Response) => {        
    res.send(videoDb)
})

videoRoute.get('/videos/:id',  (req: RequestWithParams<{id: number}>, res: Response) =>{          
    const id = +req.params.id

    const video = videoDb.find((video) => video.id === id)

    if (!video){                                                                            
        res.sendStatus(404)
        return
    }

    res.status(200).send(video)
})

videoRoute.post('/videos', (req:RequestWithBody< CreateVideoDto >, res:Response) => {

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
        
    if (errors.errorsMessages.length){  
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

videoRoute.delete('/videos', (req: Request, res: Response) => {        
    videoDb.length = 0
    res.sendStatus(204)
    return
})

videoRoute.delete('/videos/:id',  (req: RequestWithParams<{id: number}>, res: Response) =>{          
        const id = +req.params.id
        let i= videoDb.findIndex(video => video.id === id)
        console.log(i)
        if(i==-1){
            res.sendStatus(404)
            }else{
            videoDb.splice(i, 1)
        res.sendStatus(204)
        return;
    }
    })

videoRoute.put('/videos/:id', (req: RequestWithParamsBody<{id: number}, UpdateVideoDto>,  res: Response) => {  

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


videoRoute.delete('/__test__/data', (req: Request, res: Response) => {        
    videoDb.length = 0
    res.sendStatus(204)
    return
})