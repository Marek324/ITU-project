import fastify from 'fastify';
import cors from '@fastify/cors';
import { JSONFilePreset } from 'lowdb/node';
import { db_model } from './data_model.mjs';
import fastifyStatic from '@fastify/static';
import path from 'path';

const app = fastify({ logger: true });
const port = 5000;

app.register(cors,  {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.register(fastifyStatic, {
	root: path.join(process.cwd(), 'public'),
	prefix: '/public/',
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

	let data = db.data.animals;

	res.send(data);
});

app.get('/api/animals/:id', async (req, res) => {
	await db.read();

	let data = db.data.animals.find(animal => animal.id === Number(req.params.id));

	console.log(data);

	res.send(data);
});


