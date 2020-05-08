"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MusicStatsService_js_1 = __importDefault(require("./Services/MusicStatsService.js"));
//#region Setup
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
const port = process.env.PORT || 5000;
let userData;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    allowedHeaders: ["authorization", "Content-Type"],
    exposedHeaders: ["authorization"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//#endregion
app.listen(port, () => console.log(`Server running on port ${port}!`));
app.get('/', (_req, res) => {
    res.status(200).send('Please post a JSON file to /upload');
});
app.post('/upload', upload.single('path'), (req, res, next) => {
    let payLoad = {
        id: req.body.id,
        file: req.file.buffer.toString(),
        year: req.body.year
    };
    userData = MusicStatsService_js_1.default.createObj(payLoad);
    userData === null ? res.status(400).send(null) : res.status(200).send(userData);
});
//# sourceMappingURL=app.js.map