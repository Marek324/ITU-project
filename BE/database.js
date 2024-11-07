const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite'); // Use ':memory:' for an in-memory database or specify a file name for a persistent database
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS animals (id INT, image BLOB, name TEXT, text TEXT, species TEXT, age INT, sex TEXT, neutered BOOLEAN)");
	db.get("SELECT COUNT(*) AS count FROM animals", (err, row) => {
		if (err) {
			console.error(err.message);
			return;
		}

		if (row.count === 0) {
			const animals = [
				{ id: uuidv4(), image: './assets/2daa592704cb5a72ba5c3a0d799c4fc7.jpeg', name: 'Věroslav', species: 'Dog', age: 6, sex: "M", text: 'Haf', neutered: true },
				{ id: uuidv4(), image: './assets/12b572e7b1990d8697e22cdf9249f168.jpeg', name: 'Terka', species: 'Goat', age: 7, sex: "F", text: 'Beee', neutered: false },
				{ id: uuidv4(), image: './assets/7bd3178464ce91858b54c5ee91b80b21.png', name: 'Kotěšenimír', species: 'Cat', age: 5, sex: "M", text: 'Meow', neutered: false },
				{ id: uuidv4(), image: './assets/d5cdb7e0559c9a975d7c78e5cc771061.jpeg', name: 'Marek', species: 'Cat', age: 3, sex: "M", text: 'Ahoj ja jsem Marek', neutered: true },
				// Add more animal objects here
			];

			const stmt = db.prepare("INSERT INTO animals VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
			animals.forEach(animal => {
				const imageBuffer = fs.readFileSync(animal.image);
				stmt.run(animal.id, imageBuffer, animal.name, animal.text, animal.species, animal.age, animal.sex, animal.neutered);
			});
			stmt.finalize();
		}
	});
});

module.exports = db;
