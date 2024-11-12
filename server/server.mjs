import fastify from 'fastify';
import cors from '@fastify/cors';
import {Low, Memory} from 'lowdb';
import {JSONFilePreset} from 'lowdb/node';
import {db_model} from './data_model.mjs';
import fastifyStatic from '@fastify/static';
import path from 'path';
import {v4 as genId} from 'uuid';

const seed = process.argv[2] === 'seed';

const app = fastify({ logger: true });
const port = 5000;

app.register(cors, {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.register(fastifyStatic, {
	root: path.join(process.cwd(), 'public'),
	prefix: '/public/',
});

let db;
let db_seed;
(async () => {
	try {
		if (seed) {
			db_seed = await JSONFilePreset('db_seed.json', db_model);
		} else {
			db_seed = await JSONFilePreset('db.json', db_model);
		}
		db = new Low(new Memory(), db_model);
		db.data = db_seed.data;
		await db.write();
		await app.listen({port: port});
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
})();

// ================================================
// ===================== Blog =====================
// ================================================

app.get('/api/articles', async (req, res) => {
	await db.read();

	let data = db.data.articles;

	res.send(data);
});

app.get('/api/articles/:id', async (req, res) => {
	await db.read();

	let data = db.data.articles.find(article => article.id === Number(req.params.id));

	res.send(data);
});

//new
app.post('/api/articles', async (req, res) => {
	await db.read();



	const newArticle = {
		id: genId(),
		title: req.body.title,
		author: req.body.author,
		datetime: new Date(),
		content: req.body.content,
		image: req.body.image,
	};
	console.log(newArticle);

	db.data.articles.push(newArticle);

	await db.write();
	res.status(200).send({ id: articleId ,message: 'Article added successfully' });
});

//edit
app.put('/api/articles/:id', async (req, res) => {
	await db.read();

	const { id } = req.params;

	const updatedArticle = req.body;

	db.data.articles[id] = updatedArticle;

	await db.write();
	res.status(200).send({ message: 'Article updated successfully' });
});

//delete
app.delete("/api/articles/:id", async (req, res) => {
	await db.read();
	const { id } = req.params;

	db.data.articles = db.data.articles.filter(a => String(a.id) !== id);

	await db.write();
	res.code(200).send({ message: 'Article deleted successfully' });
});

// ================================================
// ===================== Animals ==================
// ================================================

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

app.put('/api/animals/:id', async (req, res) => {
	let id = Number(req.params.id);
	let updated_animal = req.body;
	updated_animal.id = id;
	try {
		await db.read();
		db.data.animals = db.data.animals.map(animal => {
			if (animal.id === id) {
				return updated_animal;
			}
			return animal;
		});
		await db.write();
		let data = db.data.animals;
		res.code(200).send(data);
	} catch (err) {
		console.error(err);
		res.code(500).send({ error: 'Failed to update the animal' });
	}
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

	// const questions = [];
	// let currentQuestion = null;

	// db.data.questions.forEach(row => {
	//   if (currentQuestion && currentQuestion.id !== row.question_id) {
	// 	questions.push(currentQuestion);
	// 	currentQuestion = null;
	//   }

	//   if (!currentQuestion) {
	// 	currentQuestion = {
	// 	  id: row.question_id,
	// 	  question: row.question,
	// 	  user_created: row.user_created,
	// 	  answers: [],
	// 	};
	//   }

	//   currentQuestion.answers.push({
	// 	id: row.answer_id,
	// 	text: row.text,
	// 	correct: row.correct,
	//   });
	// });

	// if (currentQuestion) {
	//   questions.push(currentQuestion);
	// }

	res.send( db.data.questions );
});

app.post('/api/questions', async (req, res) => {
	await db.read();

	// const new_question = {
	// 	id: genId(),
	// 	question: req.body.question,
	// 	answers: [{
	// 		id: genId(),
	// 		text: req.body.answers.text,
	// 		correct: true,
	// 	}],
	// 	user_created: true,
	// }

	let new_question = {
		id: genId(),
		question: '',
		answers: [],
		user_created: true,
	};

	Object.assign(new_question, req.body.question);

	// console.log(new_question);

	// const { question, answers, correct } = req.body;

	// let new_question = {
	// 	id: genId(),
	// 	question: question,
	// 	user_created: true,
	// }

	// console.log(new_question);

	// new_question.answers =  answers.map((answer, idx) => ({
	// 	id: genId(),
	// 	text: answer,
	// 	correct: idx === correct,
	// }));


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

//Games API
app.delete('/api/games/:id', async (req, res) => {
	await db.read();

	const { id } = req.params;

	const gameIndex = db.data.games.findIndex(g => g.id === id);

	if (gameIndex === -1) {
		res.status(404).send('Game not found');
		return;
	}

	db.data.games.splice(gameIndex, 1);

	await db.write();
	res.status(200).send({ message: 'Game deleted successfully' });
});

app.get('/api/games', async (req, res) => {
	await db.read();

	const games = db.data.games;

	res.send(games);
});

app.get('/api/games/:id', async (req, res) => {
	await db.read();

	const { id } = req.params;
	const game = db.data.games.find(g => g.id === id);

	if (!game) {
		res.status(404).send('Game not found');
		return;
	}

	res.status(200).send(game);
});

//FP API
app.delete('/api/fp/:id', async (req, res) => {
	await db.read();

	const { id } = req.params;

	const fpIndex = db.data.fp.findIndex(f => f.id === id);

	if (fpIndex === -1) {
		res.status(404).send('FP not found');
		return;
	}

	db.data.fp.splice(fpIndex, 1);

	await db.write();
	res.status(200).send({ message: 'FP deleted successfully' });
});

app.get('/api/fp/:id', async (req, res) => {
	await db.read();

	const game = db.data.fp.find(id => id.id === Number(req.params.id));

	if (!game) {
		res.status(404).send('FP not found');
		return;
	}

	res.send(game);

	res.status(200).send(game);
});

app.get('/api/fp', async (req, res) => {
	await db.read();

	const games = db.data.fp;

	res.send(games);
});

app.put('/api/fp/:id', async (req, res) => {
	await db.read();

	const { id } = req.params;

	const updatedFp = req.body;

	db.data.fp[id] = updatedFp;

	await db.write();
	res.status(200).send({ message: 'Article updated successfully' });
});
