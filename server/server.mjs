/**
 * server.mjs
 * Author: Marek Hric xhricma00
 * Author: Petra Simonova xsimon30
 * Author: Lukáš Píšek xpisek02
 * Author: Tobiáš Adamčík xadamc08
 * Author: Matouš Jašek xjasek18
 */

// xhricma00 - start
import fastify from 'fastify';
import cors from '@fastify/cors';
import {Low, Memory} from 'lowdb';
import {JSONFilePreset} from 'lowdb/node';
import fs from 'fs';
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

// xhricma00 - end

// ================================================
// ===================== PET ======================
// ================================================

app.get('/api/pet', async (req, res) => {
	await db.read();
	res.send(db.data.pet);
});

app.post('/api/pet/happiness', async (req, res) => {
	const {petId, change} = req.body;
	await db.read();

	const pet = db.data.pet.find(p => p.id === petId);
	if (!pet) {
		return res.status(404).send({error: "Pet not found"});
	}
	pet.happiness = Math.min(100, Math.max(0, (pet.happiness || 0) + change));

	await db.write();
	res.status(200).send({message: "Happiness updated successfully", pet});
});

app.post('/api/pet/quiz', async (req, res) => {
	const {petId} = req.body;

	try {
		await db.read();
		const pet = db.data.pet.find(p => p.id === petId);

		if (!pet) {
			return res.status(404).send({error: "Pet not found"});
		}
		if (pet.happiness <= 0) {
			return res.status(400).send({error: "Pet is too unhappy to play the quiz"});
		}
		const randomHappiness = Math.floor(Math.random() * 11) + 5;
		pet.happiness = Math.min(100, Math.max(0, (pet.happiness || 0) - randomHappiness));

		await db.write();

		res.status(200).send({
			message: "Quiz can be started",
			happinessReduced: randomHappiness,
			remainingHappiness: pet.happiness
		});
	} catch (error) {
		console.error('Error processing quiz request:', error);
		res.status(500).send({error: "Internal server error"});
	}
});
// ================================================
// =================== Inventory ==================
// ================================================

app.post('/api/inventory', async (req, res) => {
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
	if (itemId === 4) {
		if (inventoryItem.count > 0) {
			pet.hasHat = !pet.hasHat;
		} else {
			return res.status(400).send({error: "Cannot toggle hat, count is 0"});
		}
	} else {
		if (inventoryItem.count > 0) {
			inventoryItem.count -= 1;
		} else {
			return res.status(400).send({error: "Item count cannot be less than 0"});
		}
	}

	await db.write();
	res.status(200).send({message: "Item updated", pet});
});

// ================================================
// ===================== BUY ITEM ==================
// ================================================
app.post('/api/buy', async (req, res) => {
	const {petId, itemId} = req.body;
	await db.read();

	const animal = db.data.animals.find((a) => a.id === petId);
	if (!animal) {
		return res.status(404).send({error: "Animal not found"});
	}
	const item = db.data.shop.find((i) => i.id === itemId);
	if (!item) {
		return res.status(404).send({error: "Item not found"});
	}

	const itemPrice = parseInt(item.price.replace('¥', ''));
	if (animal.money < itemPrice) {
		return res.status(400).send({error: "Not enough money"});
	}

	animal.money -= itemPrice;

	const pet = db.data.pet.find((p) => p.id === petId);
	if (!pet) {
		return res.status(404).send({error: "Pet not found"});
	}

	const inventoryItem = pet.inventory.find((inv) => inv.id === itemId);
	if (itemId === 4) {
		const inventoryItem = pet.inventory.find((inv) => inv.id === itemId);
		if (inventoryItem && inventoryItem.count > 0) {
			return res.status(400).send({error: "You already own this item and cannot buy it again"});
		}
	}
	if (inventoryItem) {
		inventoryItem.count += 1;
	} else {
		pet.inventory.push({id: item.id, count: 1});
	}
	await db.write();
	// res.send(pet);

	res.send({
		money: animal.money,
		inventory: pet.inventory,
	});

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

app.get('/api/animal/:id/money', async (req, res) => {
	await db.read();
	const pet = db.data.animals.find(p => p.id === Number(req.params.id));
	if (!pet) {
		return res.status(404).send({error: "Pet not found"});
	}
	res.send({money: pet.money});
});

app.put('/api/animal/:id/money', async (req, res) => {
	await db.read();
	const {id} = req.params;
	const {money} = req.body;
	const pet = db.data.animals.find(p => p.id === Number(id));

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
	const animals = db.data.animals;
	const favoritedAnimalIds = db.data.favoritedAnimals;
	console.log(favoritedAnimalIds);
	const animalsWithFavorited = animals.map(animal => ({
		...animal,
		favorited: favoritedAnimalIds.includes(animal.id)
	}));

	res.send(animalsWithFavorited);
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
		res.code(500).send({error: 'Failed to update the animal'});
	}
});

app.delete('/api/animals/:id', async (req, res) => {
	let id = Number(req.params.id);
	console.log(id);
	try {
		await db.read();
		db.data.animals = db.data.animals.filter(animal => animal.id !== id);
		db.data.favoritedAnimals = db.data.favoritedAnimals.filter(animalId => animalId !== id);
		db.data.meetings = db.data.meetings.filter(meeting => meeting.animalId !== id);
		await db.write();
		let data = db.data.animals;
		res.code(200).send(data);
	} catch (err) {
		console.error(err);
		res.code(500).send({error: 'Failed to delete the animal'});
	}
});

// ================================================
// ============== Favorited animals ===============
// ================================================

app.post('/api/favoritedAnimals/:id', async (req, res) => {
	let id = Number(req.params.id);
	try {
		await db.read();
		if (!db.data.favoritedAnimals.includes(id)) {
			db.data.favoritedAnimals.push(id);
			await db.write();
			res.status(200).send({message: 'Animal added to favorited animals'});
		} else {
			res.status(400).send({error: 'Animal is already favorited'});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({error: 'Failed to add the animal to favorited animals'});
	}
});

app.delete('/api/favoritedAnimals/:id', async (req, res) => {
	let id = Number(req.params.id);
	try {
		await db.read();
		db.data.favoritedAnimals = db.data.favoritedAnimals.filter(animalId => animalId !== id);
		await db.write();
		res.status(200).send({message: 'Animal removed from favorited animals'});
	} catch (err) {
		console.error(err);
		res.status(500).send({error: 'Failed to remove the animal from favorited animals'});
	}
});

// ================================================
// ================== Meetings ====================
// ================================================

// POST /api/meetings
app.post('/api/meetings', async (req, res) => {
	let new_meeting = req.body;
	console.log(new_meeting);
	await db.read();
	new_meeting.id = db.data.meetings.length + 1;
	db.data.meetings.push(new_meeting);
	await db.write();
	await db.read();
	let meetings = db.data.meetings;
	const animals = db.data.animals;
	const meetingsWithAnimals = meetings.map(meeting => {
		const animal = animals.find(animal => animal.id === meeting.animalId);
		return {...meeting, animal};
	});

	res.send(meetingsWithAnimals);
});

// GET /api/meetings
app.get('/api/meetings', async (req, res) => {
	await db.read();
	const meetings = db.data.meetings;
	const animals = db.data.animals;

	const meetingsWithAnimals = meetings.map(meeting => {
		const animal = animals.find(animal => animal.id === meeting.animalId);
		return {...meeting, animal};
	});

	res.send(meetingsWithAnimals);
});

app.delete('/api/meetings/:id', async (req, res) => {
		let id = Number(req.params.id);
		try {
			await db.read();
			db.data.meetings = db.data.meetings.filter(meeting => meeting.id !== id);
			await db.write();
			await db.read();
			let meetings = db.data.meetings;
			const animals = db.data.animals;
			const meetingsWithAnimals = meetings.map(meeting => {
				const animal = animals.find(animal => animal.id === meeting.animal);
				return {...meeting, animal};
			});

			res.send(meetingsWithAnimals);
		} catch (err) {
			console.error(err);
			res.code(500).send({error: 'Failed to delete the meeting'});
		}
	}
);

// ================================================
// =================== Questions ==================
// ================================================

app.get('/api/questions', async (req, res) => {
	await db.read();
	res.send(db.data.questions);
});

app.post('/api/questions', async (req, res) => {
	await db.read();

	let new_question = {
		id: genId(),
		question: '',
		answers: [],
		correctAnswer: req.body.correctAnswer,
		user_created: true,
	};

	Object.assign(new_question, req.body.question);
	db.data.questions.push(new_question);

	await db.write();
	res.status(200).send({message: 'Question added successfully'});
});

app.post('/api/quiz/progress', async (req, res) => {
	const {currentQuestionIndex, selectedAnswerIndex, userAnswer} = req.body;

	await db.read();
	const questions = db.data.questions;

	if (!questions || questions.length === 0) {
		return res.status(404).send({error: 'No questions available'});
	}

	const currentQuestion = questions[currentQuestionIndex];
	if (!currentQuestion) {
		return res.status(404).send({error: 'Question not found'});
	}

	let isCorrect = false;
	if (currentQuestion.user_created) {
		const correctAnswerText = currentQuestion.correctAnswer?.trim().toLowerCase() || '';
		const userAnswerTrimmed = (userAnswer || '').trim().toLowerCase();
		isCorrect = userAnswerTrimmed === correctAnswerText;
	} else {
		const correctAnswer = currentQuestion.answers.find((ans) => ans.correct);
		if (correctAnswer) {
			isCorrect = selectedAnswerIndex !== null && correctAnswer.text === currentQuestion.answers[selectedAnswerIndex].text;
		}
	}

	res.status(200).send({
		isCorrect,
		nextQuestionIndex: currentQuestionIndex + 1,
		hasMoreQuestions: currentQuestionIndex + 1 < questions.length,
		correctAnswersCount: isCorrect ? 1 : 0,
		currentQuestion,
	});
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
	const {id} = req.params;
	const fpEntry = db.data.fp.find(fp => fp.id === Number(id));

	if (!fpEntry) {
		res.status(404).send({message: 'FP entry not found'});
		return;
	}

	res.status(200).send(fpEntry);
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

app.put('/api/fp/:id/colors', async (req, res) => {
	await db.read();
	const {id} = req.params;
	const colors = req.body;
	const fpEntry = db.data.fp.find(fp => fp.id === Number(id));

	if (!fpEntry) {
		res.status(404).send({message: 'FP entry not found'});
		return;
	}

	fpEntry.boughtColors = colors;
	await db.write();
	res.status(200).send({message: 'FP colors updated successfully', fpEntry});
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

	const { maxHeight, difficulty } = req.body;

	if (typeof maxHeight !== 'number' || !difficulty) {
		return res.status(400).send({ error: 'Invalid maxHeight or difficulty' });
	}

	const newGame = {
		id: genId(),
		height: maxHeight,
		difficulty: difficulty,
		date: new Date().toISOString(),
	};

	// Initialize hop array if it doesn't exist
	if (!db.data.hop) {
		db.data.hop = [];
	}

	db.data.hop.push(newGame);

	await db.write();
	res.status(200).send({ message: 'Game saved successfully', id: newGame.id });
});

app.get('/api/hop/highest/:difficulty', async (req, res) => {
	await db.read();
	const { difficulty } = req.params;

	// Initialize hop array if it doesn't exist
	if (!db.data.hop) {
		db.data.hop = [];
	}
	
	const highestGame = db.data.hop
		.filter(game => game.difficulty === difficulty)
		.reduce((max, game) => 
			game.height > max.height ? game : max, 
			{ height: 0, id: null, date: null, difficulty }
		);
	res.status(200).send(highestGame);
});

app.get('/api/hop/scores/:difficulty', async (req, res) => {
	await db.read();
	const { difficulty } = req.params;

	// Initialize hop array if it doesn't exist
	if (!db.data.hop) {
		db.data.hop = [];
	}

	const scores = db.data.hop
		.filter(game => game.difficulty === difficulty)
		.map(game => game.height);
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

app.get('/api/images', async (req, res) => {
	const directoryPath = path.join(process.cwd(), 'public', 'imgs');
	try {
		const files = await fs.promises.readdir(directoryPath);
		const fileNamesWithoutExtension = files.map(file => file.replace('.jpg', ''));
		res.send(fileNamesWithoutExtension);
	} catch (err) {
		res.status(500).send({error: 'Unable to scan directory'});
	}
});

// DoodleJump Inventory Endpoints
app.get('/api/doodlejump/inventory/:petId', async (req, res) => {
    await db.read();
    const pet = db.data.pet.find(p => p.id === Number(req.params.petId));
    
    if (!pet) {
        return res.status(404).send({ error: "Pet not found" });
    }

    // Initialize doodleJumpInventory if it doesn't exist
    if (!pet.doodleJumpInventory) {
        pet.doodleJumpInventory = {
            characters: ['dog'],  // Default character
            backgrounds: ['bg1'], // Default background
            currentCharacter: 'dog',
            currentBackground: 'bg1'
        };
        await db.write();
    }

    res.send(pet.doodleJumpInventory);
});

app.post('/api/doodlejump/buy', async (req, res) => {
    const { petId, itemId, itemType } = req.body;
    await db.read();

    const pet = db.data.pet.find(p => p.id === Number(petId));
    if (!pet) {
        return res.status(404).send({ error: "Pet not found" });
    }

    const animal = db.data.animals.find(a => a.id === Number(petId));
    if (!animal) {
        return res.status(404).send({ error: "Animal not found" });
    }

    // Check if enough money
    if (animal.money < 100) {
        return res.status(400).send({ error: "Not enough money" });
    }

    // Initialize inventory if it doesn't exist
    if (!pet.doodleJumpInventory) {
        pet.doodleJumpInventory = {
            characters: ['dog'],
            backgrounds: ['bg1'],
            currentCharacter: 'dog',
            currentBackground: 'bg1'
        };
    }

    // Add item to appropriate array if not already owned
    const targetArray = itemType === 'character' ? 'characters' : 'backgrounds';
    if (!pet.doodleJumpInventory[targetArray].includes(itemId)) {
        pet.doodleJumpInventory[targetArray].push(itemId);
        animal.money -= 100;
        await db.write();
    }

    res.send({
        inventory: pet.doodleJumpInventory,
        money: animal.money
    });
});

app.post('/api/doodlejump/select', async (req, res) => {
    const { petId, itemId, itemType } = req.body;
    await db.read();

    const pet = db.data.pet.find(p => p.id === Number(petId));
    if (!pet) {
        return res.status(404).send({ error: "Pet not found" });
    }

    // Check if item is owned
    const targetArray = itemType === 'character' ? 'characters' : 'backgrounds';
    const targetCurrent = itemType === 'character' ? 'currentCharacter' : 'currentBackground';

    if (pet.doodleJumpInventory[targetArray].includes(itemId)) {
        pet.doodleJumpInventory[targetCurrent] = itemId;
        await db.write();
    }

    res.send(pet.doodleJumpInventory);
});
