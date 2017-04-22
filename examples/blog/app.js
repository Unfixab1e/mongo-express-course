const express = require('express')
const path = require('path')
const logger = require('morgan')
// const cons = require('consolidate')
const bodyParser = require('body-parser')

const userService = require('./services/userMemService')

const app = express()

// view engine setup
// app.engine('html', cons.mustache
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('common'))

app.get('/test', (req, res) => {
  res.send('<h1>How dare you test me like this!</h1>')
})

app.get('/users', (req, res) => {
  userService.list(users => {
    res.render('list', {users: users})
  })
})

app.get('/users/add', (req, res) => {
  let initUser = {
    "name": "",
    "role": "Guest",
    "email": "",
    "score": 0,
    "img": "guest.png"
  }
  res.render('edit', {user: initUser})
})

app.post('/users/add', (req, res) => {
  userService.create(req.body, id => {
    res.redirect(id + '/view')
  })
})

app.get('/users/:id/view', (req, res) => {
  userService.detail(req.params.id, user => {
    res.render('view', {user: user})
  })
})

app.get('/users/:id/del', (req, res) => {
  userService.remove(req.params.id, _ => {
    res.redirect('/users')
  })
})

app.get('/users/:id/edit', (req, res) => {
  userService.detail(req.params.id, user => {
    res.render('edit', {user: user})
  })
})

app.post('/users/:id/edit', (req, res) => {
  userService.modify(req.params.id, req.body, _ => {
    res.redirect('./view')
  })
})

app.listen(3000, () => {
  console.log('Express server running on port 3000')
})
