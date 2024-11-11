const fs = require('fs');

const db = 'db.json';

const readData = () => {
	try {
		return JSON.parse(fs.readFileSync(db, 'utf8'));
	} catch (error) {
		console.error('Error reading or parsing the file: ', error);
		alert('Error reading or parsing the file: ' + error);
		if(error.code === 'ENOENT') {
			writeData({});
			return {};
		}
	}
};

const writeData = (data) => {
	try {
		fs.writeFileSync(db, JSON.stringify(data, null, 2));
	} catch (error) {
		console.error('Error writing the file:', error);
	}
}

const updateHighScore = (score) => {
	const data = readData();
	data.score = score;
	writeData(data);
}

const getHighScore = () => {
	const data = readData();
	return data.score;
}
