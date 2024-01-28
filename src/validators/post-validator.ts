import { body } from "express-validator";
import { inputModelValidation } from "../middlewares/inputModel/input-model-validation";
import { BlogRepository } from "../repositories/blog-repository";

export const postPostValidation = [
    body('title')
    .isString()
    .withMessage('Incorrect title! Title must be a string')
    .trim()
    .isLength({min:1,max:30})
    .withMessage('Incorrect title! Title length should be [1, 30]'),

    body('shortDescription')
    .isString()
    .withMessage('Incorrect content! Content must be a string')
    .trim()
    .isLength({min:1,max:100})
    .withMessage('Incorrect shortDescription! ShortDescription length should be [1, 100]'), 

    body('content')
    .isString()
    .withMessage('Incorrect content! Content must be a string')
    .trim()
    .isLength({min:1,max:1000})
    .withMessage('Incorrect content! Content length should be [1, 1000]'), 
    
    body('blogId')
    .isString()
    .withMessage('Incorrect blogId! BlogId must be a string')
    .trim()
    .notEmpty()
    .withMessage('Incorrect blogId! BlogId should be some information')
    .custom(async id => {
        const foundBlogID = await BlogRepository.getBlogById(id)
    if (!foundBlogID){
        throw new Error('Incorrect blogId')
    }
        return true
    }
    ) 
    .withMessage('Incorrect blogId!'),

    inputModelValidation]