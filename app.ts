import MusicStatsService from './Services/MusicStatsService.js';
import { MyActivity } from './Interfaces/Models/IMyActivity.js';

//#region Setup
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 5000;

let userData: MyActivity;

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

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

//#endregion

app.listen(port, () => console.log(`Server running on port ${port}!`));

app.get('/', (_req, res) => {
	res.status(200).send('Please post a JSON file to /upload');
});

app.post(
	'/upload',
	upload.single('path'),
	(
		req: { body: { id: string; year: string }; file: { buffer: Buffer } },
		res: { status: Function; send: Function },
		next: any
	) => {
		let payLoad: { id: string; file: string; year: string } = {
			id: req.body.id,
			file: req.file.buffer.toString(),
			year: req.body.year,
		};

		userData = MusicStatsService.createObj(payLoad);
		userData === null
			? res.status(400).send(null)
			: res.status(200).send(userData);
	}
);
