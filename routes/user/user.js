const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const router = express.Router();
const date = require('date-and-time')
const {registerValidate, updateUserValidate} = require('../../validate');
const { findOne } = require('../../models/User');
const verify = require('../verifyToken');


//Add new User

router.post('/register', verify, async(req, res)=>{
    try{
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
                if(req.body.role == 'A'){
                    res.status(400).send({message: "User Cannot add admin role"});
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
                    const saveUser = await user.save();
                    res.status(200).json(saveUser);
                }
                
            }
        }
    }catch(e){

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
            if(user.role == "A"){
                res.status(400).send({message: "User cannot view Admin"});
            }
            else{
                res.status(200).send({user, jwt: token});
            }
            
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

            jwt.verify(token, process.env.TOKEN_SECRET, async(err, decoded)=>{
                if(decoded._id == req.params.id){
                    const removedUser = await User.remove({_id: req.params.id});
                    res.status(200).send({deleteUser: removedUser, user: user, jwt: token});
                }
                else{
                    res.status(400).send({message: "Invalid Access"});
                }
            })

            
        }

    }catch(e){
        console.log(e);
        res.status(500).send({message: e});
    }
    
});

//Update User

router.patch('/:id', verify, async(req, res)=>{
    try{

        const {error} = updateUserValidate(req.body);
        if(error){
            res.status(400).send(error.details[0].message);
        }
        else{
            const token = req.header('auth-token');
        const user = await User.findOne({_id: req.params.id});
        if(!user){
            res.status(401).send({message: "User does not exists"});
        }
        else{
            if(user.role == 'A'){
                res.status(400).send({message: "Invalid Access"});
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
                            department: req.body.department,
                            updateDate: updateTime,
                        }
                    },
                );
                const user = await User.findOne({_id: req.params.id});
                res.status(200).send({updateUser: updateUser, user: user, jwt: token});
            }
            
        }
        }   
    }catch(e){
        console.log(e);
        res.status(500).send({message: e});
    }
})

module.exports = router;