const helmet = require('helmet');//http security

const express = require('express');//returns a function
const app= express();//returns an object from the funciton

const patients = require('./routes/patients');

app.use(express.json());
//middleware functionparses the request body and if there is  a json object it will set 
//req.body and pass control to the next middleware funciton

app.use(express.urlencoded({ extended: true}));//for urlencoded payloads

app.use(helmet());//http security middleware function

app.use('/api/patients',patients);

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`Listening on port ${port}... `));
//http://localhost:8000/