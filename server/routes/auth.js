const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Get user profile (and lazy-create public.users row if missing)
router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, email, theme, "profilePic" FROM public.users WHERE id = $1', [req.user.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Rename postgres column to match frontend expectations
    const user = rows[0];
    user.profilePic = user.profilePic || user['profilePic'];
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  const { username, theme, profilePic } = req.body;
  
  try {
    let sql = 'UPDATE public.users SET username = $1, theme = $2';
    let params = [username, theme || 'light'];
    if (profilePic !== undefined) {
      sql += ', "profilePic" = $3';
      params.push(profilePic);
    }

    sql += ` WHERE id = $${params.length + 1}`;
    params.push(req.user.id);

    await pool.execute(sql, params);

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

