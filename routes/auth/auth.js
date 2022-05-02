const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
const {registerValidate, loginValidate} = require('../../validate');
const { findOne } = require('../../models/User');


//Sign up a User
router.post('/register', async(req,res)=>{

    const {error} = registerValidate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }
    else{

        const emailExist = await User.findOne({email: req.body.email});

        if(emailExist){
            return res.status(400).send({message: "Email Already Exists"});
        }
        else{
            const hashPassword = bcrypt.hashSync(req.body.password, 10);
            const user = new User({
                first_name: req.body.first_name,
                middle_name: req.body.middle_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: hashPassword,
                role: req.body.role,
            });
        try{
            const saveUser = await user.save();
            res.status(200).json(saveUser);
        }catch(e){
            res.status(500).json({message: e});
        }
        }
    }

    
});

//Login

router.post('/login', async(req, res)=>{
    const {error} = loginValidate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }
    else{
        const user = await User.findOne({email : req.body.email});
        if(!user){
            res.status(400).send({message: "Email doesn't exists"});
        }
        else{
            const validatePass = await bcrypt.compare(req.body.password, user.password);
            if(!validatePass){
                res.status(400).send({message: "Invalid passowrd"});
            }
            else{
                const token = jwt.sign({_id: user._id, role: user.role}, process.env.TOKEN_SECRET);
                res.status(200).header('auth-token', token).send({login: user, jwt: token});
            }
        }
    }
});

module.exports = router;