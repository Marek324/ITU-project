import fastify from 'fastify';
import cors from '@fastify/cors';
import {Low, Memory} from 'lowdb';
import {JSONFilePreset} from 'lowdb/node';
import {db_model} from './data_model.mjs';
import fastifyStatic from '@fastify/static';
import path from 'path';
import {v4 as genId} from 'uuid';

const seed = process.argv[2] === 'seed';

const app = fastify({logger: true});
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

	let data = db.data.articles.find(article => String(article.id) === req.params.id);

	res.send(data);
});

//new
app.post('/api/articles', async (req, res) => {
	await db.read();


	const newArticle = {
		id: genId(),
		title: req.body.title,
		author: req.body.author,
		date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
		content: req.body.content,
		image: req.body.image,
	};
	console.log(newArticle);

	db.data.articles.push(newArticle);

	await db.write();
	res.status(200).send({id: articleId, message: 'Article added successfully'});
});

//edit
app.put('/api/articles/:id', async (req, res) => {
	await db.read();

	const {id} = req.params;

	const updatedArticle = req.body;

	db.data.articles[id] = updatedArticle;

	await db.write();
	res.status(200).send({message: 'Article updated successfully'});
});

//delete
app.delete("/api/articles/:id", async (req, res) => {
	await db.read();
	const {id} = req.params;

	db.data.articles = db.data.articles.find(a => String(a.id) !== id);

	await db.write();
	res.code(200).send({message: 'Article deleted successfully'});
});

// ================================================
// ===================== PET =====================
// ================================================
app.get('/api/pet', async (req, res) => {
	await db.read();
	res.send(db.data.pet);
});

// ================================================
// ===================== DECREMENT ITEM COUNT ======
// ================================================

app.post('/api/decrement', async (req, res) => {
	const {petId, itemId} = req.body;
	await db.read();
	const pet = db.data.pet.find((p) => p.id === petId);
	if (!pet) {
		return res.status(404).send({error: "Pet not found"});
	}
	const inventoryItem = pet.inventory.find((inv) => inv.id === itemId);
	if (!inventoryItem) {
		return res.status(404).send({error: "Item not found in inventory"});
	}
	if (itemId !== 4) {
		if (inventoryItem.count > 0) {
			inventoryItem.count -= 1;
		} else {
			return res.status(400).send({error: "Item count cannot be less than 0"});
		}
	}
	await db.write();
	res.status(200).send({message: "Item count decremented", pet});
});

// ================================================
// ===================== BUY ITEM ==================
// ================================================

app.post('/api/buy', async (req, res) => {
	const {petId, itemId} = req.body;
	await db.read();

	const pet = db.data.pet.find((p) => p.id === petId);
	if (!pet) {
		return res.status(404).send({error: "Pet not found"});
	}

	const item = db.data.shop.find((i) => i.id === itemId);
	if (!item) {
		return res.status(404).send({error: "Item not found"});
	}

	const itemPrice = parseInt(item.price.replace('¥', ''));
	if (pet.money < itemPrice) {
		return res.status(400).send({error: "Not enough money"});
	}
	pet.money -= itemPrice;

	const inventoryItem = pet.inventory.find((inv) => inv.id === itemId);
	if (inventoryItem) {
		inventoryItem.count += 1;
	} else {
		pet.inventory.push({id: item.id, count: 1});
	}
	await db.write();
	res.send(pet);
});

// ================================================
// ===================== SHOP =====================
// ================================================

app.get('/api/shop', async (req, res) => {
	await db.read();
	res.send(db.data.shop);
});

app.get('/api/shop/:id', async (req, res) => {
	await db.read();
	const item = db.data.shop.find(item => item.id === req.params.id);
	if (!item) {
		res.status(404).send({message: 'Item not found'});
		return;
	}
	res.send(item);
});

app.post('/api/shop', async (req, res) => {
	await db.read();
	const newItem = {
		id: genId(),
		name: req.body.name,
		price: req.body.price,
		count: req.body.count,
		icon: req.body.icon,
	};
	db.data.shop.push(newItem);
	await db.write();
	res.status(201).send({message: 'Item added successfully', item: newItem});
});

app.put('/api/shop/:id', async (req, res) => {
	await db.read();
	const index = db.data.shop.findIndex(item => item.id === req.params.id);
	if (index === -1) {
		res.status(404).send({message: 'Item not found'});
		return;
	}
	db.data.shop[index] = {...db.data.shop[index], ...req.body};
	await db.write();
	res.status(200).send({message: 'Item updated successfully', item: db.data.shop[index]});
});

app.delete('/api/shop/:id', async (req, res) => {
	await db.read();
	const index = db.data.shop.findIndex(item => item.id === req.params.id);
	if (index === -1) {
		res.status(404).send({message: 'Item not found'});
		return;
	}
	db.data.shop.splice(index, 1);
	await db.write();
	res.status(200).send({message: 'Item deleted successfully'});
});

app.get('/api/pet/:id/money', async (req, res) => {
	await db.read();
	const pet = db.data.pet.find(p => p.id === Number(req.params.id));
	if (!pet) {
		return res.status(404).send({error: "Pet not found"});
	}
	res.send({money: pet.money});
});

app.put('/api/pet/:id/money', async (req, res) => {
	await db.read();
	const {id} = req.params;
	const {money} = req.body;
	const pet = db.data.pet.find(p => p.id === Number(id));

	if (!pet) {
		res.status(404).send({message: 'Pet not found'});
		return;
	}

	pet.money = money;
	await db.write();
	res.status(200).send({message: 'Pet money updated successfully', pet});
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

app.get('/api/articles/:id/chat', async (req, res) => {
	await db.read();
	const {id} = req.params;
	const data = db.data.chat.find(chat => String(chat.article_id) === id);
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
		res.code(500).send({error: 'Failed to update the animal'});
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
		res.code(500).send({error: 'Failed to delete the animal'});
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

	res.send(db.data.questions);
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
	res.status(200).send({message: 'Question added successfully'});
});

app.delete('/api/questions/:id', async (req, res) => {
	await db.read();

	const {id} = req.params;

	const questionIndex = db.data.questions.findIndex(q => q.id === id);

	if (questionIndex === -1) {
		res.status(404).send('Question not found');
		return;
	}

	db.data.questions.splice(questionIndex, 1);

	await db.write();
	res.status(200).send({message: 'Question deleted successfully'});
});

// ================================================
// ===================== GAMES ====================
// ================================================
//NOT SURE IF WORKING

app.delete('/api/games/:id', async (req, res) => {
	await db.read();

	const {id} = req.params;

	const gameIndex = db.data.games.findIndex(g => g.id === id);

	if (gameIndex === -1) {
		res.status(404).send('Game not found');
		return;
	}

	db.data.games.splice(gameIndex, 1);

	await db.write();
	res.status(200).send({message: 'Game deleted successfully'});
});

app.get('/api/games', async (req, res) => {
	await db.read();

	const games = db.data.games;

	res.send(games);
});

app.get('/api/games/:id', async (req, res) => {
	await db.read();

	const game = db.data.games.find(id => id.id === Number(req.params.id));

	if (!game) {
		res.status(404).send('FP not found');
		return;
	}

	res.send(game);

	res.status(200).send(game);
});

// ================================================
// ===================== FP =======================
// ================================================

app.delete('/api/fp/:id', async (req, res) => {
	await db.read();

	const {id} = req.params;

	const fpIndex = db.data.fp.findIndex(f => f.id === id);

	if (fpIndex === -1) {
		res.status(404).send('FP not found');
		return;
	}

	db.data.fp.splice(fpIndex, 1);

	await db.write();
	res.status(200).send({message: 'FP deleted successfully'});
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

app.get('/api/pet/:id/colors', async (req, res) => {
	await db.read();
	const pet = db.data.pet.find(p => p.id === Number(req.params.id));
	if (!pet) {
		return res.status(404).send({error: "Pet not found"});
	}
	res.send({boughtColors: pet.boughtColors});
});

app.put('/api/pet/:id/colors', async (req, res) => {
	await db.read();
	const {id} = req.params;
	const {colors} = req.body;
	const pet = db.data.pet.find(p => p.id === Number(id));

	if (!pet) {
		res.status(404).send({message: 'Pet not found'});
		return;
	}

	pet.boughtColors = colors;
	await db.write();
	res.status(200).send({message: 'Pet colors updated successfully', pet});
});

app.get('/api/fp/:id/leaderboards', async (req, res) => {
	await db.read();
	const {id} = req.params;
	const fpEntry = db.data.fp.find(fp => fp.id === Number(id));

	if (!fpEntry) {
		return res.status(404).send({message: 'FP entry not found'});
	}

	res.send(fpEntry.leaderboards);
});


app.post('/api/hop', async (req, res) => {
	await db.read();

	const {maxHeight} = req.body;

	if (typeof maxHeight !== 'number') {
		return res.status(400).send({error: 'Invalid maxHeight'});
	}

	const newGame = {
		id: genId(),
		height: maxHeight,
		date: new Date().toISOString(),
	};

	db.data.hop.push(newGame);

	await db.write();
	res.status(200).send({message: 'Game saved successfully', id: newGame.id});
});

app.get('/api/hop/highest', async (req, res) => {
	await db.read();
	const highestGame = db.data.hop.reduce((max, game) => game.height > max.height ? game : max, {height: 0});
	res.status(200).send(highestGame);
});

app.get('/api/hop/scores', async (req, res) => {
	await db.read();
	const scores = db.data.hop.map(game => game.height);
	res.status(200).send(scores);
});

app.put('/api/fp/:id', async (req, res) => {
	await db.read();

	const {id} = req.params;
	const index = db.data.fp.findIndex(fp => fp.id === Number(id));

	if (index === -1) {
		res.status(404).send({message: 'FP not found'});
		return;
	}

	db.data.fp[index] = {...db.data.fp[index], ...req.body};
	await db.write();
	res.status(200).send({message: 'FP updated successfully'});
});
