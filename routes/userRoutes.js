const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

//root route for users since we already put "/user" in the start of the route in server.js
router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router