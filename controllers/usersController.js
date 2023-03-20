const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//desc - Get all users
//route - GET / users
//access - Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        res.status(400).json({ message: 'No users found.' })
    }
    res.json(users)
})

//desc - Create User
//route - POST / users
//access - Private
const createNewUser = asyncHandler(async (req, res) => {
    //destructured data from front end request
    const { username, password, roles } = req.body
    //confirm the data we get from the frontend
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields required' })
    }
    //check for duplicates
    const duplicate = await User.findOne({username}).lean().exec()
    if (duplicate) {
        res.status(409).json({ message: 'Duplicate username' })
    }
    //Hash the password ensure it is secured even in the database
    const hashedPwd = await bcrypt.hash(password, 10)
    //redefine the user object before saving the new user
    const userObject = {username, "password":hashedPwd, roles}
    //create and store the new user
    const user = User.create(userObject)
    //once the user is created check
    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data recieved'})
    }
})

//desc - Update User
//route - PATCH / users
//access - Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

//desc - Delete a User
//route - DELETE / users
//access - Private
const deleteUser = asyncHandler(async (req, res) => {
    //destructure id to identify which user needs to be deleted
    const { id } = req.body
    //check if the id exists
    if (!id) {
        return res.status(400).json({ message: 'User Id required' })
    }
    //check if that user id has any notes assigned if it does we dont want to delete that user
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }
    //define user
    const user = await User.findById(id).exec()
    if (!user) {
        res.status(400).json({ message: 'User not found' })
    }
    //result will hold the deleted user information
    const result = await user.deleteOne()
    const reply = `Username ${result.username} with Id ${result._id} deleted`
    res.json(reply)
})

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser }