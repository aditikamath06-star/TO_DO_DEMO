const pool = require('./db');

async function migrate() {
  try {
    console.log('Adding profilePic column...');
    await pool.execute('ALTER TABLE users ADD COLUMN profilePic LONGTEXT');
    console.log('Successfully added profilePic column.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column profilePic already exists.');
    } else {
      console.error('Error during migration:', err);
    }
  } finally {
    process.exit(0);
  }
}

migrate();
