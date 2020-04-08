const express= require('express');
const router = express.Router();//returns a router object to be used in index.js
const Joi = require('joi');

//each patient is an object with two properties
const patients = [
    {id:1, patientCode: '2176', name:'patient1', lineNumber:'1', time:'1581116201937', appointmentTime:'1581222660000'},
    {id:2, patientCode: '1', name:'patient2', lineNumber:'2', time:'1581270946179', appointmentTime:'1581271200000'},
    {id:3, patientCode: '4076', name:'patient3', lineNumber:'3', time:'1581116201937', appointmentTime:'1000020020000'}
];



//HTTP GET///////////////////////////////////////////////////////////////////////////////////
//real world example would want to get patients from database and return them
router.get('/', (req, res)=>{
    res.send(patients);
});

router.get('/:patientCode',(req, res)=>{
    const patient = patients.find(p=>parseInt(p.patientCode)===parseInt(req.params.patientCode));//req.params refers to /:id
    if(!patient)return res.status(404).send('The patient with the given patientCode was not found.');
    res.send(patient);
});




//HTTP POST///////////////////////////////////////////////////////////////////////////////////
router.post('/',(req,res)=>{

    //set up Joi schema
    const schema={
        patientCode: Joi.string().min(3).required(),//fluent API
        name: Joi.string().min(3).required(),//fluent API
        lineNumber: Joi.string().min(1).required(),//fluent API
        time: Joi.string().min(3).required(),//fluent API
        appointmentTime: Joi.string().min(3).required()//fluent API

    };


    const result = Joi.validate(req.body,schema);//validate method returns an object

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        //or instead of using first element you would want to acess all
        //elements in the array, get their mesage property and concatenate them
        return; 
    }
    
    const patient = {
        id: patients.length +1,
        patientCode:req.body.patientCode,
        name:req.body.name,
        lineNumber:req.body.lineNumber,
        time:req.body.time,
        appointmentTime:req.body.appointmentTime
    };
    patients.push(patient);

    res.send(patient);
   
});



//HTTP PUT///////////////////////////////////////////////////////////////////////////////////
router.put('/:patientCode', (req,res)=>{
    //Look up the patient with the given id
    const patient = patients.find(p=> parseInt(p.patientCode) === parseInt(req.params.patientCode));
    //if not existing, return 404
    if(!patient){
        res.status(404).send('The patient with the given Patient Code was not found.');
        return;
    }

    
    // //Object destructuring
    // const {error}= validatePatient(req.body);
    // //validate
    // //If invalid, return 400 - Bad request
    // if(error)return res.status(400).send(error.details[0].message);
   
    //Update patient
    patient.appointmentTime= req.body.appointmentTime;//patient points to patient object in patients array
    //return the updated patient
    res.send(patient);
});


function validatePatient(patient){
    const schema={
        name:Joi.string().min(3).required()
    };

    return Joi.validate(patient,schema);//req.body=patient
}


//HTTP DELETE///////////////////////////////////////////////////////////////////////////////////
router.delete('/:patientCode',(req,res)=>{
    //Look up the patient
    //Not existing, return 404
    const patient = patients.find(p=> parseInt(p.patientCode) === parseInt(req.params.patientCode));
    if(!patient) return res.status(404).send('The patient with the given Patient Code was not found.');

    //Delete
    const index = patients.indexOf(patient);
    //use the splice method to remove an object from our patients array
    patients.splice(index,1);//got to this index and remove 1 object

    //Return the same patient
    res.send(patient);
});



module.exports = router;