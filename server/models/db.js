const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '128.85.33.174',
  user: 'charan',
  password: 'charan',
  database: 'user_management',
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL database');
});

module.exports = db;
