import { AvailableResolutions } from "./output"

export type CreateVideoDto = {                                                  //Запрос на отправку данных Body
    title: "string", 
    author: "string", 
    availableResolutions: typeof AvailableResolutions
}

export type UpdateVideoDto = {                                           
    title: string, 
    author: string, 
    availableResolutions: typeof AvailableResolutions,
    canBeDownloaded: boolean,
    minAgeRestriction: number,
    publicationDate: string
}