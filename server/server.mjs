import fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs/promises';
import { JSONFilePreset } from 'lowdb/node';
import { db_model } from './data_model.mjs';

const app = fastify({ logger: true });
const port = 5000;

app.register(cors,  {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

let db;
(async () => {
	try {
		db = await JSONFilePreset('db_seed.json', db_model);
		await app.listen({port: port});
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
})();

app.get('/api/animals', async (req, res) => {
	await db.read();
	const {animals} = db.data;

	const data = animals.map(animal => convImgs(animal));

	res.send(data);
});

app.get('/api/animals/:id', async (req, res) => {
	await db.read();

	const data = await convImgs(db.data.animals.find(animal => animal.id === Number(req.params.id)));
	console.log(data);
	res.send(data);
});

async function convImgs(obj) {
	for (const key in obj) {
		if (typeof obj[key] === 'string' && obj[key].startsWith('assets/')) {
			try {
				const fileContent = await fs.readFile(obj[key]);
				obj[key] = fileContent.toString('base64');
			} catch (error) {
				console.error(`Failed to convert ${obj[key]}:`, error.message);
			}
		} else if (typeof obj[key] === 'object' && obj[key] !== null) {
			convImgs(obj[key]); // Recurse for nested objects
		}
	}
	return obj;
}


