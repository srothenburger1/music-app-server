"use strict";
exports.__esModule = true;
var MusicStatsService_js_1 = require("../Services/MusicStatsService.js");
//#region Setup
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var app = express();
var port = process.env.PORT || 5000;
var userData;
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
app.listen(port, function () { return console.log("Server running on port " + port + "!"); });
app.get('/', function (_req, res) {
    res.status(200).send('Please post a JSON file to /upload');
});
app.post('/upload', upload.single('path'), function (req, res, next) {
    var payLoad = {
        id: req.body.id,
        file: req.file.buffer.toString(),
        year: req.body.year
    };
    userData = MusicStatsService_js_1["default"].createObj(payLoad);
    userData === null ? res.status(400).send(null) : res.status(200).send(userData);
});
