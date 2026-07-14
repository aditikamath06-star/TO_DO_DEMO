const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Connected to SQLite database');
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT NOT NULL,
        category TEXT NOT NULL,
        dueDate TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        createdAt INTEGER NOT NULL
      )
    `);
  }
});

// Helper function to map row to task object
const mapTask = (row) => ({
  ...row,
  completed: row.completed === 1
});

// Routes
// 1. Get all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(mapTask));
  });
});

// 2. Create a new task
app.post('/api/tasks', (req, res) => {
  const { id, title, description, priority, category, dueDate, completed, createdAt } = req.body;
  const sql = `
    INSERT INTO tasks (id, title, description, priority, category, dueDate, completed, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    id || Date.now(),
    title,
    description || '',
    priority || 'MEDIUM',
    category || 'WORK',
    dueDate || '',
    completed ? 1 : 0,
    createdAt || Date.now()
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      id: params[0],
      title,
      description: params[2],
      priority: params[3],
      category: params[4],
      dueDate: params[5],
      completed: params[6] === 1,
      createdAt: params[7]
    });
  });
});

// 3. Update a task
app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, priority, category, dueDate, completed, createdAt } = req.body;
  const sql = `
    UPDATE tasks 
    SET title = ?, description = ?, priority = ?, category = ?, dueDate = ?, completed = ?, createdAt = ?
    WHERE id = ?
  `;
  const params = [
    title,
    description || '',
    priority || 'MEDIUM',
    category || 'WORK',
    dueDate || '',
    completed ? 1 : 0,
    createdAt,
    id
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: parseInt(id, 10), title, description, priority, category, dueDate, completed, createdAt });
  });
});

// 4. Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted', id });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
