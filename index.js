const helmet = require('helmet');//http security
const config = require('config');
const express = require('express');//returns a function
const app= express();//returns an object from the funciton
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const users = require('./routes/users');
const patients = require('./routes/patients');

if (!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

mongoose.set('useCreateIndex', true);//(node:7268) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.connect('mongodb://localhost/wroom',  { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
//middleware functionparses the request body and if there is  a json object it will set 
//req.body and pass control to the next middleware funciton
app.use(express.urlencoded({ extended: true}));//for urlencoded payloads
app.use(helmet());//http security middleware function
app.use('/api/auth', auth)
app.use('/api/patients',patients);
app.use('/api/users', users);

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`Listening on port ${port}... `));
//http://localhost:8000/

//set wroom_jwtPrivateKey=mySecureKey
