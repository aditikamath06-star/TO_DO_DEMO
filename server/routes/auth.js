const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://lrsbckwyfkulmbjnrsiq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyc2Jja3d5Zmt1bG1iam5yc2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzg5OTIsImV4cCI6MjA5OTc1NDk5Mn0.dkqzDHdkYzvSYwzP7Sq41ag4sO_3yhbkQxaICYv-Y5A';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    
    if (data.user) {
      const uname = username || email.split('@')[0];
      await pool.execute(
        'INSERT INTO public.users (id, username, email, theme) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
        [data.user.id, uname, email, 'light']
      );
    }
    res.json({ token: data.session?.access_token || 'no_session' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ token: data.session.access_token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

