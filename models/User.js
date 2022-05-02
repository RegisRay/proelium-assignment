const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    middle_name: String,
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        min: 6,
        max: 12,
    },
    password:{
        type: String,
        required:true,
    },
    role:{
        type: String,
        required: true,
        max: 1
    },
    department: String,
    createTime:{
        type: Date,
        default: Date.now,
        required: true,
    },
    updateDate:{
        type: Date,
        default: Date.now,
        required: true,
    }
});

module.exports = mongoose.model('User', UserSchema);