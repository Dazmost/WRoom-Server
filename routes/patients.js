const {Patient, validate} = require('../models/patient')
const mongoose = require('mongoose');
const express= require('express');
const _ = require('lodash');
const router = express.Router();//returns a router object to be used in index.js

//HTTP GET///////////////////////////////////////////////////////////////////////////////////
//real world example would want to get patients from database and return them
router.get('/', async (req, res)=>{
    const patients = await Patient.find().sort('lineNumber')
    res.send(patients);
});

router.get('/:id',async (req, res)=>{
    const patient = await Patient.findById(req.params.id);
    if(!patient)return res.status(404).send('The patient with the given ID was not found.');
    res.send(patient);
});

router.get('/code/:patientCode',async (req, res)=>{
    const patient = await Patient.findOne({patientCode: req.params.patientCode});
    if(!patient)return res.status(404).send('The patient with the given patientCode was not found.');
    res.send(patient);
});


//HTTP POST///////////////////////////////////////////////////////////////////////////////////
router.post('/', async (req,res)=>{

    const { error } = validate(req.body);//validate method returns an error object result.error
    if(error) return res.status(400).send(error.details[0].message);
    
    let patient = new Patient({
        patientCode:req.body.patientCode,
        name:req.body.name,
        lineNumber:req.body.lineNumber,
        time:req.body.time,
        appointmentTime:req.body.appointmentTime
    });
    patient = await patient.save();

    res.send(patient);
});



//HTTP PUT///////////////////////////////////////////////////////////////////////////////////
router.put('/code/:patientCode', async (req,res)=>{
    //const { error } = validate(req.body);
    //if (error) return res.status(400).send(error.details[0].message);
    
    const patient = await Patient.findOneAndUpdate({patientCode: req.params.patientCode},
        {
            //lineNumber:req.body.lineNumber,
            appointmentTime:req.body.appointmentTime
        }, { new: true });

    if(!patient) return res.status(404).send('The patient with the given Patient Code was not found.');

    res.send(patient);
});

router.put('/:id', async (req,res)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const patient = await Patient.findByIdAndUpdate(req.params.id,
        {
            //lineNumber:req.body.lineNumber,
            appointmentTime:req.body.appointmentTime
        }, { new: true });

    if(!patient) return res.status(404).send('The patient with the given ID was not found.');

    res.send(patient);
});


//HTTP DELETE///////////////////////////////////////////////////////////////////////////////////
router.delete('/code/:patientCode',async (req,res)=>{

    const patient = await Patient.findOneAndRemove({patientCode: req.params.patientCode});
    if(!patient) return res.status(404).send('The patient with the given Patient Code was not found.');

    res.send(patient);
});

router.delete('/:id',async (req,res)=>{
    const patient = await Patient.findByIdAndRemove(req.params.id);
    if(!patient) return res.status(404).send('The patient with the given Patient Code was not found.');

    res.send(patient);
});



module.exports = router;