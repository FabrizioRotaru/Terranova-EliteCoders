import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    , CHECK (
        length(password) BETWEEN 8 AND 18
        AND password GLOB '*[A-Z]*'
        AND password GLOB '*[^A-Za-z0-9]*'
    )
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

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html>
        <body>
            <h1>Login or Register</h1>
            <form action="/login" method="post">
                <label>Email</label>
                <input type="text" name="username">
                <label>Password</label>
                <input type="password" name="password">
                <button type="submit">Login</button>
            </form>
            <form action="/register" method="post">
                <label>Email</label>
                <input type="text" name="username">
                <label>Password</label>
                <input type="password" name="password">
                <button type="submit">Register</button>
            </form>
        </body>
    </html>`);
});

app.post('/login', (req, res) => {
    // Validate user login in the database
    res.json({ message: 'Login successful' });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run(`INSERT INTO Login (username, password) VALUES (?, ?)`,
        [username, password],
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ message: 'User registered', id: this.lastID });
        }
    );
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});