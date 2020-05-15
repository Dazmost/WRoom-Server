const Joi = require('joi');
const mongoose = require('mongoose');

//each patient is an object with two properties
// const patients = [
//     {id:1, patientCode: '2176', name:'patient1', lineNumber:'1', time:'1581116201937', appointmentTime:'1581222660000'},
//     {id:2, patientCode: '1', name:'patient2', lineNumber:'2', time:'1581270946179', appointmentTime:'1581271200000'},
//     {id:3, patientCode: '4076', name:'patient3', lineNumber:'3', time:'1581116201937', appointmentTime:'1000020020000'}
// ];

const Patient = mongoose.model('Patient', new mongoose.Schema({
    patientCode: {
        type: String,
        required: true,
        minlength:4,
        maxlength:5
    },

    name:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },

    lineNumber: {
        type: String,
        required: true,
        minlength:1,
        maxlength:5
    },

    time:{
        type: String,
        required: true,
    },

    appointmentTime:{
        type: String,
        required: true,
    },

}));

function validatePatient (patient){
    const schema = {
        patientCode: Joi.string().min(4).max(5).required(),
        name: Joi.string().min(2).max(50).required(),
        lineNumber: Joi.string().min(1).max(5).required(),
        time: Joi.string().min(1).required(),
        appointmentTime: Joi.string().min(1).required()
    };

    return Joi.validate(patient, schema);
}

exports.Patient = Patient;
exports.validate = validatePatient;