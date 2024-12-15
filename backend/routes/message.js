const express = require('express');
const sendMessageController = require('../controllers/message')
const protectRoute = require('../middleware/AuthUser')

const route = express.Router();

route.post('/sendMessage/:id',protectRoute,sendMessageController.sendMessage)
route.get('/getMessage/:id',protectRoute,sendMessageController.getMessages)

module.exports = route;