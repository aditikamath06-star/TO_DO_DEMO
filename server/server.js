const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
const authRouter = require('./routes/auth');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);

// Helper to map DB row to JS boolean for completed
const mapTask = (row) => ({
  ...row,
  completed: row.completed === 1
});

// 1. Get all tasks for the logged in user
app.get('/api/tasks', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
    res.json(rows.map(mapTask));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create a new task
app.post('/api/tasks', auth, async (req, res) => {
  const { title, description, priority, category, dueDate, completed, createdAt } = req.body;
  const sql = `
    INSERT INTO tasks (user_id, title, description, priority, category, dueDate, completed, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    req.user.id,
    title,
    description || '',
    priority || 'MEDIUM',
    category || 'WORK',
    dueDate || '',
    completed ? 1 : 0,
    createdAt || Date.now()
  ];

  try {
    const [result] = await pool.execute(sql, params);
    res.json({
      id: result.insertId,
      user_id: req.user.id,
      title,
      description: params[2],
      priority: params[3],
      category: params[4],
      dueDate: params[5],
      completed: params[6] === 1,
      createdAt: params[7]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update a task
app.put('/api/tasks/:id', auth, async (req, res) => {
  const id = req.params.id;
  const { title, description, priority, category, dueDate, completed, createdAt } = req.body;
  const sql = `
    UPDATE tasks 
    SET title = ?, description = ?, priority = ?, category = ?, dueDate = ?, completed = ?, createdAt = ?
    WHERE id = ? AND user_id = ?
  `;
  const params = [
    title,
    description || '',
    priority || 'MEDIUM',
    category || 'WORK',
    dueDate || '',
    completed ? 1 : 0,
    createdAt,
    id,
    req.user.id
  ];

  try {
    const [result] = await pool.execute(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to edit it.' });
    }
    res.json({ id: parseInt(id, 10), user_id: req.user.id, title, description, priority, category, dueDate, completed, createdAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete a task
app.delete('/api/tasks/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or you do not have permission to delete it.' });
    }
    res.json({ message: 'Task deleted', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
