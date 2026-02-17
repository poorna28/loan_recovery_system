const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ...existing code...
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
    // Optionally: process.exit(1);
  } else {
    console.log('Connected to MySQL database');
  }
});
// ...existing code...
module.exports = db;
