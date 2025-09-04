const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const customerRoutes = require('./routes/customerRoutes');
app.use('/api', customerRoutes);

app.use('/api/auth', require('./routes/authRoutes'));


module.exports = app;
