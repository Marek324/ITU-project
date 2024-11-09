const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = 5001;

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
app.get('/api/questions', (req, res) => {
	db.all(`
	  SELECT q.id AS question_id, q.question, q.user_created, a.id AS answer_id, a.text, a.correct
	  FROM questions q
	  LEFT JOIN answers a ON q.id = a.question_id
	  ORDER BY q.id, a.id
	`, (err, rows) => {
	  if (err) {
		res.status(500).send(err.message);
		return;
	  }
  
	  const questions = [];
	  let currentQuestion = null;
  
	  rows.forEach(row => {
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
  
	  res.json({ questions });
	});
  });
  
  const { v4: uuidv4 } = require('uuid');

  app.post('/api/questions', (req, res) => {
	const { question, answer, correct } = req.body;
  
	if (!question || !answer || correct === undefined) {
	  return res.status(400).json({ message: "Missing required fields" });
	}
  
	const questionId = uuidv4(); 
  
	db.serialize(() => {
	  db.run(
		"INSERT INTO questions (id, question, user_created) VALUES (?, ?, ?)", 
		[questionId, question, true], 
		function (err) {
		  if (err) {
			return res.status(500).json({ message: "Error saving question: " + err.message });
		  }
  
		  db.run(
			"INSERT INTO answers (question_id, text, correct, user_created) VALUES (?, ?, ?, ?)", 
			[questionId, answer, correct, true], 
			function (err) {
			  if (err) {
				return res.status(500).json({ message: "Error saving answer: " + err.message });
			  }
  
			  return res.status(200).json({ message: "Question and answer saved successfully!" });
			}
		  );
		}
	  );
	});
  });
  
  app.delete('/api/questions/:id', async (req, res) => {
	const { id } = req.params;
	console.log("Received delete request for question ID:", id);  
  
	try {
	  db.run(`DELETE FROM answers WHERE question_id = ?`, [id], function(err) {
		if (err) {
		  console.error('Error deleting related answers:', err);
		  return res.status(500).json({ error: 'Failed to delete related answers' });
		}
	  });
  
	  db.run(`DELETE FROM questions WHERE id = ?`, [id], function(err) {
		if (err) {
		  console.error('Error deleting question:', err);
		  return res.status(500).json({ error: 'Failed to delete question' });
		}
		if (this.changes > 0) {
		  res.status(200).json({ message: 'Question deleted successfully' });
		} else {
		  res.status(404).json({ error: 'Question not found' });
		}
	  });
	} catch (error) {
	  console.error('Error deleting question:', error);
	  res.status(500).json({ error: 'Failed to delete question' });
	}
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
