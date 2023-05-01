/*const express = require('express')
const router = express.Router()
const User = require('../models/user')

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
  
app.post('/', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      const newUser = await author.save()
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports = router*/