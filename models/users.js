const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var db = mongoose.connection;

 
//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    token:{
        type:String  
    }
    //schema for login
    // name: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     unique: true
    // }


});

 UserSchema.pre('save', function (next) {
   this.password = bcrypt.hashSync(this.password, saltRounds);
   next();
 });

module.exports = mongoose.model('User', UserSchema);