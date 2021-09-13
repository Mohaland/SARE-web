const express = require('express');
const web = express.Router();

// Controllers
const adminController = require('../controllers/admin');
const houseController = require('../controllers/house');


// Middlewares
const auth = require('../middleware/auth_web');

// Authentication
web.get('/register', adminController.register);
web.get('/login', adminController.page);
web.post('/login/:token', adminController.login);
web.get('/logout', adminController.logout);

web.get('/', auth, adminController.index);
web.get('/appointments', auth, adminController.appointments);

module.exports = web;