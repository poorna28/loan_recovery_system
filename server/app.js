const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const customerRoutes = require('./routes/customerRoutes');
app.use('/api', customerRoutes);

const loanRoutes = require('./routes/loanRoutes');
app.use('/api', loanRoutes);


app.use('/api/auth', require('./routes/authRoutes'));


module.exports = app;
