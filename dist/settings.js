"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
var AvailableResolutions;
(function (AvailableResolutions) {
    AvailableResolutions["P144"] = "P144";
    AvailableResolutions["P240"] = "P144";
    AvailableResolutions["P360"] = "P144";
    AvailableResolutions["P480"] = "P480";
    AvailableResolutions["P720"] = "P480";
    AvailableResolutions["P1080"] = "P480";
    AvailableResolutions["P1440"] = "1440";
    AvailableResolutions["P2160"] = "P1440";
})(AvailableResolutions || (AvailableResolutions = {}));
let videoDb = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-10-18T10:11:43.720Z",
        publicationDate: "2023-10-18T10:11:43.720Z",
        availableResolutions: [
            AvailableResolutions.P144
        ]
    }
];
exports.app.get('/videos', (req, res) => {
    res.send(videoDb);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videoDb.find((video) => video.id === id);
    if (!video) { //Ошибка при неверном ID
        res.sendStatus(404);
        return;
    }
    res.status(200).send(video);
});
exports.app.post('/videos', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || !title.length || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Invalid author', field: 'author' });
    }
    if (Array.isArray(availableResolutions) && availableResolutions.length) {
        const isValid = availableResolutions.every(el => Object.values(AvailableResolutions).includes(el));
        if (!isValid) {
            errors.errorsMessages.push({
                message: 'Invalid availableResolutions',
                field: 'availableResolutions'
            });
        }
    }
    if (errors.errorsMessages.length) { //Вывод ошибки при наличии ошибок
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    videoDb.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.delete('/videos', (req, res) => {
    videoDb.length = 0;
    res.sendStatus(204);
    return;
});
exports.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    let i = videoDb.findIndex(video => video.id === id);
    console.log(i);
    if (i == -1) {
        res.send(204);
    }
    else {
        videoDb.splice(i, 1);
        res.sendStatus(404);
        return;
    }
});
exports.app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videoDb.find((video) => video.id === id);
    if (video) {
        const errors = {
            errorsMessages: []
        };
        const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
        if (!title || !title.trim() || title.length > 40) {
            errors.errorsMessages.push({ message: 'Incorrect title', field: 'title' });
        }
        if (!author || !author.trim() || author.length > 20) {
            errors.errorsMessages.push({ message: 'Incorrect author', field: 'author' });
        }
        if (Array.isArray(availableResolutions) && availableResolutions.length) {
            const isValid = availableResolutions.every(el => Object.values(AvailableResolutions).includes(el));
            if (!isValid) {
                errors.errorsMessages.push({
                    message: 'Incorrect availableResolutions',
                    field: 'availableResolutions'
                });
            }
        }
        if (typeof canBeDownloaded !== 'undefined' && typeof canBeDownloaded !== 'boolean') { //&&
            errors.errorsMessages.push({
                message: 'Incorrect canBeDownLoaded',
                field: 'canBeDownLoaded'
            });
        }
        if (!minAgeRestriction || typeof minAgeRestriction !== 'number' || minAgeRestriction > 18 || minAgeRestriction < 1) { //>18
            errors.errorsMessages.push({
                message: 'Incorrect minAgeRestriction',
                field: 'minAgeRestriction'
            });
        }
        if (!publicationDate || typeof publicationDate !== 'string') { // ==?
            errors.errorsMessages.push({
                message: 'Incorrect publicationDate',
                field: 'publicationDate'
            });
        }
        if (errors.errorsMessages.length) {
            res.sendStatus(400).send(errors);
        }
        else {
            video.availableResolutions = availableResolutions;
            video.minAgeRestriction = minAgeRestriction;
            video.canBeDownloaded = canBeDownloaded || false;
            video.publicationDate = publicationDate;
            video.title = title;
            video.author = author;
            res.status(204).send();
        }
    }
    else {
        res.send(404);
    }
});
