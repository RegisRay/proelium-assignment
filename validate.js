const Joi = require('@hapi/joi');

const registerValidate = (data) =>{
    const schema = Joi.object({
        first_name: Joi.string().required(),
        middle_name: Joi.string(),
        last_name: Joi.string().required(),
        password: Joi.string().min(6).max(12).required(),
        email: Joi.string().required().email(),
        role: Joi.string().max(1).required(),
        department: Joi.string(),
    });
    return schema.validate(data);    
}

const loginValidate = (data) =>{
    const schema = Joi.object({
        password: Joi.string().min(6).max(12).required(),
        email: Joi.string().required().email(),
    });
    return schema.validate(data);    
}

const updateUserValidate = (data) =>{
    const schema = Joi.object({
        first_name:Joi.string().min(4),
        last_name:Joi.string().min(4),
        middle_name: Joi.string(),
        email: Joi.string().email(),
        department: Joi.string()
    })
}


module.exports.registerValidate = registerValidate;
module.exports.loginValidate = loginValidate;
module.exports.updateUserValidate = updateUserValidate;

