import fastify from 'fastify';
import cors from '@fastify/cors';
import { JSONFilePreset } from 'lowdb/node';
import { db_model } from './data_model.mjs';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { v4 as genId } from 'uuid';

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

	res.send(data);
});

app.post('/api/animals', async (req, res) => {
	let new_animal = req.body;
	await db.read();
	new_animal.id = db.data.animals.length + 1;
	db.data.animals.push(new_animal);
	await db.write();
	let data = db.data.animals;
	res.send(data);

});

app.delete('/api/animals/:id', async (req, res) => {
	let id = Number(req.params.id);
	console.log(id);
	try {
		await db.read();
		db.data.animals = db.data.animals.filter(animal => animal.id !== id);
		await db.write();
		let data = db.data.animals;
		res.code(200).send(data);
	} catch (err) {
		console.error(err);
		res.code(500).send({ error: 'Failed to delete the animal' });
	}
});

app.get('/api/questions', async (req, res) => {
	await db.read();

	const questions = [];
	let currentQuestion = null;

	db.data.questions.forEach(row => {
	  if (currentQuestion && currentQuestion.id !== row.question_id) {
		questions.push(currentQuestion);
		currentQuestion = null;
	  }

	  if (!currentQuestion) {
		currentQuestion = {
		  id: row.question_id,
		  question: row.question,
		  user_created: row.user_created,
		  answers: [],
		};
	  }

	  currentQuestion.answers.push({
		id: row.answer_id,
		text: row.text,
		correct: row.correct,
	  });
	});

	if (currentQuestion) {
	  questions.push(currentQuestion);
	}

	res.send({ questions });
});

app.post('/api/questions', async (req, res) => {
	const { question, answers, correct } = req.body;

	if (!question || !answers || !correct) {
		res.status(400).send('Missing required fields');
		return;
	}

	await db.read();


	let new_question = {
		id: genId(),
		question: question,
		user_created: true,
	}

	new_question.answers = answers.map((answer, idx) => ({
		id: genId(),
		text: answer,
		correct: idx === correct,
	}));

	db.data.questions.push(new_question);

	await db.write();
	res.status(200).send({ message: 'Question added successfully' });
});

app.delete('/api/questions/:id', async (req, res) => {
	await db.read();

	const { id } = req.params;

	const questionIndex = db.data.questions.findIndex(q => q.id === id);

	if (questionIndex === -1) {
		res.status(404).send('Question not found');
		return;
	}

	db.data.questions.splice(questionIndex, 1);

	await db.write();
	res.status(200).send({ message: 'Question deleted successfully' });
});


