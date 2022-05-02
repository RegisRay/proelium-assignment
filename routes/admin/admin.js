const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcryptjs'); 
const router = express.Router();
const date = require('date-and-time')
const {registerValidate, loginValidate} = require('../../validate');
const { findOne } = require('../../models/User');
const verify = require('../verifyToken');


//Add new User

router.post('/register', verify, async(req, res)=>{
    const{error} = registerValidate(req.body);
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

//View User

router.get('/:id', verify, async(req, res)=>{
    try{
        const token = req.header('auth-token');
        const user = await User.findOne({_id: req.params.id});
        if(!user){
            res.status(401).send({message: "User does not exists"});
        }
        else{
            delete user['password'];
            res.status(200).send({user, jwt: token});
        }
    }catch(e){
        res.status(500).send({message: e});
    }
    
});

// Delete User

router.delete('/:id',verify, async(req, res)=>{
    try{
        const token = req.header('auth-token');
        const user = await User.findOne({_id: req.params.id});
        if(!user){
            res.status(401).send({message: "User does not exists"});
        }
        else{
            const removedUser = await User.remove({_id: req.params.id});
            res.status(200).send({deleteUser: removedUser, jwt: token});
        }
    }catch(e){
        res.status(500).send({message: e});
    }
    
});

//Update User

router.patch('/:id', verify, async(req, res)=>{
    try{
        const token = req.header('auth-token');
        const user = await User.findOne({_id: req.params.id});
        if(!user){
            res.status(401).send({message: "User does not exists"});
        }
        else{
            const now = new Date();
            const updateTime = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            const updateUser = await User.updateOne(
                {
                    _id: req.params.id
                },
                {
                    $set: {
                        first_name: req.body.first_name,
                        middle_name: req.body.middle_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        updateDate: updateTime,
                    }
                },
            );
            const user = await User.findOne({_id: req.params.id});
            res.status(200).send({updateUser: updateUser, user: user, jwt: token});
        }
    }catch(e){
        console.log(e);
        res.status(500).send({message: e});
    }
})

module.exports = router;