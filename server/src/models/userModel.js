/*For more info on creating mongoose schemas refer to
https://mongoosejs.com/docs/guide.html#definition
*/
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    email : {
        type : String,
        required : 'You must enter this field!'
    },
    nickname: {
        type: String,
        required: false,
        default: null
    },
    vehicles: [{
        make: {
            type: String,
            required: true, 
        },
        model: {
            type: String,
            required: true, 
        },
        year: {
            type: String,
            required: true, 
        },
        licensePlate: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true
        }
    }],
    password : {
        type : String,
        required: 'You must enter this field!'
    },
    host : {
        type : Boolean,
        required: 'You must enter this field!'
    },
    sessionId : {
        type: String,
        default: null,
        required: false
    },
    firstName: {
        type: String,
        default: null,
        required: 'You must enter this field!'
    },
    lastName: {
        type: String, 
        default: null,
        required: 'You must enter this field!'
    },
    phoneNumber: {
        type: String, 
        default: null,
        required: 'You must enter this field!'
    },
    stripeId:{
        type: String,
        default: "",
        required: false
    }
});



module.exports = mongoose.model('User', UserSchema);