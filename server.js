import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
app.use(express.json());

const db = new sqlite3.Database('cocktail.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the cocktail database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Login (
        username TEXT NOT NULL PRIMARY KEY,
        password TEXT NOT NULL
    )`);
});

app.put('/login', (req, res) => {
    const { username, password } = req.body;
    db.run(`INSERT INTO Login (username, password) VALUES (?, ?)`,
        [username, password],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: 'User added successfully', id: this.lastID });
        }
    );
});

app.get('/login/:username', (req, res) => {
    const username = req.params.username;
    db.get(`SELECT * FROM Login WHERE username = ?`, [username], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(row);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});