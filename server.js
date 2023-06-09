if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
  
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

//const indexRouter = require('./routes/index')
const User = require('./models/user')

const initializePassport = require('./public/passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
 
const users = []

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
  
const mongoose = require('mongoose')
mongoose.connect(/*process.env.DATABASE_URL*/'mongodb+srv://ciuffo56:ccPassword@creaturecombat.pstdmvc.mongodb.net/creature_combat?retryWrites=true&w=majority', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
  
//app.use('/', indexRouter)

app.get('/', checkAuthenticated, (req, res)=> {
  res.render('index', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      wins: req.body.wins,
      losses: req.body.losses
    })
    /*const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    const newUser = await user.save()*/
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.get('/userConnect', checkAuthenticated, (req, res) => {
  res.render('userConnect')
})

app.post('/userConnect', async (req, res) => {
  try {
    if (req.body.update) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      wins: req.body.wins || 1,
      losses: req.body.losses || 1
    })
    const result = await User.findOneAndUpdate(
      { name: user.name, email: user.email },
      { $inc: { wins: user.wins, losses: user.losses }},
      { new: true }
    )
    if(Boolean(result)) {
      console.log('Wins and losses updated', result)
    } else {
      const newUser = await user.save()
    }
    }
    res.redirect('/')
  } catch (err) {
    console.log(err)
    res.redirect('/userConnect')
  }
})

/*
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
*/

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
  
app.listen(process.env.PORT || 3000)