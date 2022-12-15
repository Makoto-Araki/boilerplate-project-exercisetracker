// Import & Config
const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser');
const users = require('./model/users');
const cors = require('cors');
const app = express();
require('dotenv').config()

// Secrets
const user = process.env['user']
const pass = process.env['pass']
const cluster = process.env['cluster']
const option = process.env['option']
const database = process.env['database']

// Mongo_URI
const mongo_URI = `mongodb+srv://${user}:${pass}@${cluster}/${database}?${option}`;

// MongoDB Connect Config
mongoose.set('strictQuery', false);

// MongoDB Connect
mongoose.connect(mongo_URI)
.then(() => console.log('Database connection successed'))
.catch(err => console.error(err))

// Basic Config
app.use(cors())
app.use(express.static('public'))

// GET - [base_url]/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// 


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
