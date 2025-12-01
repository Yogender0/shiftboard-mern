const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

// Connect DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shiftboard', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error', err));

// Models
const User = require('./models/User');
const Employee = require('./models/Employee');
const Shift = require('./models/Shift');

// Seed users
const seed = require('./seed');
seed();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/shifts', require('./routes/shifts'));

app.listen(PORT, ()=> console.log('Server running on port', PORT));
