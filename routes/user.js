const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

//Creating a User
router.post('/', async(req,res)=>{
    try{
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        const user = new User({
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashPassword,
            role: req.body.role,
        });

        const saveUser = await user.save();
        res.status(200).json(saveUser);
    }catch(e){
        res.status(500).json({message: e});
    }
}) 

module.exports = router;