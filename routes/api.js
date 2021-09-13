const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

// controllers
const authController = require('../controllers/auth')
const houseController = require('../controllers/house')
const appointmentController = require('../controllers/appointment')

// middleware
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')

// cors middleware
router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Content-Type", "application/json")
  next()
})

// parse request body
router.use(bodyParser.json({ strict: false }))
router.use(bodyParser.urlencoded({ extended: false }))

// automatically set authorization header from session if user logged in
router.use((req, res, next) => {
  if (req.session.user && req.cookies.access_token) {
    const token = req.cookies.access_token
    req.headers.authorization = token
    res.setHeader('authorization', token)
  }

  next()
})

// api default
router.get('/', (req, res, next) => {
  return res.json({ app: process.env.APP_NAME, version: "v1.0.0" })
})

// authentication
router.get('/auth/exists/:email', authController.exists)
router.post('/auth/register', authController.create)
router.post('/auth/login', authController.login)
router.get('/auth/check/:token', authController.check)

// houses
router.get('/houses', houseController.index)
router.get('/houses/agent/:id', houseController.agent)
router.post('/houses/search', houseController.search)
router.get('/houses/:id', houseController.single)
router.post('/houses', multer, houseController.create)
router.put('/houses/:id', multer, houseController.update)
router.delete('/houses/:id', houseController.delete)

// appointments
router.get('/appointments/user/:id', appointmentController.index)
router.post('/appointments', appointmentController.create)
router.put('/appointments/:id', appointmentController.update)
router.delete('/appointments/:id', appointmentController.delete)

module.exports = router