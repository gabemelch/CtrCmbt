const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

mongoose.connect('mongodb://localhost:27017/Users', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });
  const User = mongoose.model('User', userSchema);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.set('view engine', 'ejs');
  app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));
  app.get('/', (req, res) => {
    res.render('login');
  });
  app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect('/');
      } else {
        if (user) {
          bcrypt.compare(password, user.password, (err, result) => {
            if (result === true) {
              req.session.user = user;
              res.redirect('/dashboard');
            } else {
              res.send('Incorrect email or password!');
            }
          });
        } else {
          res.send('Incorrect email or password!');
        }
      }
    });
  });
  
  app.get('/signup', (req, res) => {
    res.render('signup');
  });
  
  app.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const user = new User({
          email: email,
          password: hash
        });
        user.save((err) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/');
          }
        });
      }
    });
  });
