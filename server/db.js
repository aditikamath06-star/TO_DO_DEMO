const mysql = require('mysql2/promise');
require('dotenv').config();

/*
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'adap8076',
  database: 'todolist2_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
*/
const pool = {
  execute: async () => { return [[], []]; },
  getConnection: async () => { return { release: () => {} }; }
};

const originalExecute = pool.execute.bind(pool);

pool.execute = async (sql, params) => {
  let mySqlStr = sql;

  // Translate Postgres ON CONFLICT DO NOTHING to MySQL INSERT IGNORE
  if (mySqlStr.includes('ON CONFLICT') && mySqlStr.includes('DO NOTHING')) {
    mySqlStr = mySqlStr.replace(/INSERT INTO/i, 'INSERT IGNORE INTO');
    mySqlStr = mySqlStr.replace(/ON CONFLICT.*DO NOTHING/i, '');
  }

  // Convert $1, $2 to ?
  mySqlStr = mySqlStr.replace(/\$\d+/g, '?');

  // Convert public.users to users
  mySqlStr = mySqlStr.replace(/public\.users/g, 'users');

  // Convert Postgres double quotes for specific columns
  mySqlStr = mySqlStr.replace(/"profilePic"/g, 'profilePic');
  mySqlStr = mySqlStr.replace(/"dueDate"/g, 'dueDate');
  mySqlStr = mySqlStr.replace(/"createdAt"/g, 'createdAt');
  
  // Convert RETURNING id
  mySqlStr = mySqlStr.replace(/RETURNING id/i, '');

  try {
    return await originalExecute(mySqlStr, params);
  } catch (err) {
    console.error('Database Error:', err.message, 'Query:', mySqlStr);
    throw err;
  }
};

pool.connect = async () => {
  const conn = await pool.getConnection();
  return {
    release: () => conn.release()
  };
};

module.exports = pool;
