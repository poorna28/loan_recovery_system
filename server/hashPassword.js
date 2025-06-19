const bcrypt = require('bcrypt');

const password = 'yourpassword'; // Replace with your desired password

bcrypt.hash(password, 10).then(hash => {
  console.log('Hashed password:', hash);
});