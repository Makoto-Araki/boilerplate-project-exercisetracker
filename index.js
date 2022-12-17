// Import & Config
const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser');
const users = require('./model/users');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { check, validationResult } = require('express-validator');

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
app.post('/api/users/:_id/exercises',
[ // express-validator check functions
  check('_id', '_id can not be empty').notEmpty(),
  check('description', 'description can not be empty').notEmpty(),
  check('duration', 'duration can not be empty').notEmpty(),
  check('duration', 'duration should be integer').isInt(),
  check('date', 'date is invalid').isDate(),
],
(req, res) => {
  
  // Receive error information
  let errInfo = validationResult(req);
  
  if (!errInfo.isEmpty()) {
    res.send(errInfo);
  } else {
    users
    .findById({ _id: req.params._id })
    .exec((err1, doc1) => {
      if (!err1) {

        // Initialize date
        let myDate = new Date();
        
        if (req.body.date === '') {
          myDate = new Date();
        } else {
          myDate = new Date(req.body.date);
        }

        // For Debug
        // console.log(`Debug : ${myDate.toDateString()}`);
        
        users
        .updateOne(
          { _id: { $eq: req.params._id } },
          { $push:
            { log:
              {
                description: req.body.description,
                duration: req.body.duration,
                date: myDate,
              }
            }
          },
          (err2, doc2) => {
            if (!err2) {

              res.json({
                _id: req.params._id,
                username: doc1.username,
                date: myDate.toDateString(),
                duration: parseInt(req.body.duration),
                description: req.body.description,
              });

            } else {
              console.error(err2);
            }
          }
        );

      } else {
        console.error(err1);
      }
    });
  }
});

// GET - [base_url]/api/users/:_id/logs
app.get('/api/users/:_id/logs', (req, res) => {
  //*
  users
    .findById({ _id: req.params._id })
    .exec((err1, doc1) => {
      if (!err1) {
        
        // For Debug
        // console.log(`Debug : username = ${doc1.username}`);
        // console.log(`Debug : count = ${doc1.log.length}`);
        // console.log(`Debug : _id = ${req.params._id}`);
        // console.log(`Debug : log = ${doc1.log}`);
        // console.log(`-------------------------`);
        
        res.json({
          username: doc1.username,
          count: doc1.log.length,
          _id: req.params._id,
          log: doc1.log,
        });
        
      } else {
        console.error(err1)
      }
    });
  //*/
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
