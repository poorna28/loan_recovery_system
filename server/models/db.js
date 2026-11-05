<<<<<<< HEAD
=======
const fs = require('fs');
>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
<<<<<<< HEAD
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
=======
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(__dirname + '/../config/ca.pem'),
    rejectUnauthorized: true
  }
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

>>>>>>> fea1bb0f049d2f496625218d0a39caa6ea140391
module.exports = db;
