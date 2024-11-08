const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/animals', (req, res) => {
	db.all("SELECT * FROM animals", (err, rows) => {
		if (err) {
			res.status(500).send(err.message);
			return;
		}
		rows.forEach(row => {
			row.image = row.image.toString('base64');
		});
		res.json(rows);
	});
});

app.get('/api/animals/:id', (req, res) => {
	db.get("SELECT * FROM animals WHERE id = ?", [req.params.id], (err, row) => {
		if (err) {
			res.status(500).send(err.message);
			return;
		}
		if (!row) {
			res.status(404).send('Animal not found');
			return;
		}
		row.image = row.image.toString('base64');
		res.json(row);
	});
});

app.get('/api/users/:id', (req, res) => {
	db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, row) => {
		if (err) {
			res.status(500).send(err.message);
			return;
		}
		if (!row) {
			res.status(404).send('User not found');
			return;
		}
		row.image = row.image.toString('base64');
		res.json(row);
	});
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
