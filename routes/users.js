//ALWAYS SET THIS TO USE THE ROUTE
//set wroom_jwtPrivateKey=mySecureKey
//Set Up user model, this and auth middleware
//config files and check if the environment variable is set in index.js
const { User, validate} = require('../models/user');
const auth = require('../middleware/auth')
//const config = require('config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

//HTTP GET///////////////////////////////////////////////////////////////////////////////////
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');//req.user is from auth middleware
    res.send(user);
});

//HTTP POST///////////////////////////////////////////////////////////////////////////////////
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne( {email: req.body.email});
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt =  await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['id', 'name', 'email']));
});

module.exports = router;