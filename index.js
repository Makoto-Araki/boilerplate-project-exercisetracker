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
app.use(parser.json());  // to support JSON-encoded bodies
app.use(parser.urlencoded({ extended: true }));  // to support URL-encoded bodies

// GET - [base_url]/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// POST - [base_url]/api/users
app.post('/api/users', (req, res) => {
  let entry = new users();
  entry.username = req.body.username;
  entry.save((err, doc) => {
    if (!err) {
      res.json({
        username: doc.username,
        _id: doc._id,
      });
    } else {
      console.error(err);
    }
  });
});

// GET - [base_url]/api/users
app.get('/api/users', (req, res) => {
  users
  .find({})
  .exec((err, doc) => {
    if (!err) {
      res.json(doc);
    } else {
      console.error(err);
    }
  });
});

// POST - [base_url]/api/users/:_id/exercises
app.post('/api/users/:_id/exercises', (req, res) => {
  let entryUser = '';
  
  users
  .find({ _id: req.params._id })
  .exec((err, doc) => {
    if (!err) {
      entryUser = doc.username;
    } else {
      console.error(err);
    }
  });
  
  users
  .updateMany(
    { _id: req.params._id },
    { $push: 
      { log: 
        { 
          description: req.body.description,
          duration: parseInt(req.body.duration),
          date: (new Date(req.body.date)),
        }
      }
    },
    (err, doc) => {
      if (!err) {
        res.json({
          username: entryUser,
          description: req.body.description,
          duration: parseInt(req.body.duration),
          date: (new Date(req.body.date)).toDateString(),
          _id: req.params._id,
        })
      } else {
        console.error(err);
      }
    }
  )
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
