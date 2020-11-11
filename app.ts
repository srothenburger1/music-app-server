//@ts-nocheck

import { sortMusicData } from './Services/MusicStatsService.js';
import { sortYTData } from './Services/YTMusicService.js';

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
app.use(
	cors({
		allowedHeaders: ['authorization', 'Content-Type'],
		exposedHeaders: ['authorization'],
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
	})
);

app.use(function (_req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

//#endregion

app.listen(port, () => console.log(`Server running on port ${port}!`));

app.get('/', (_req: any, res) => {
	res.status(200).send('Please post a JSON file to /upload');
});

app.post(
	'/upload',
	upload.single('path'),
	(
		req: {
			body: { year: string };
			file: { buffer: Buffer };
			headers: { ['user-agent']: string };
		},
		res: { status: Function; send: Function }
	) => {
		const today = new Date();
		const year =
			today.getMonth() < 10 ? today.getFullYear() - 1 : today.getFullYear();

		let payLoad: { file: string; year: number } = {
			file: req.file.buffer.toString(),
			year: year,
		};

		if (JSON.stringify(payLoad.file).includes('YouTube Music')) {
			userData = sortYTData(payLoad);
		} else {
			userData = sortMusicData(payLoad);
		}

		userData === null
			? res.status(400).send(null)
			: res.status(200).send(userData);
		console.log(new Date(), req.headers['user-agent']);
	}
);
