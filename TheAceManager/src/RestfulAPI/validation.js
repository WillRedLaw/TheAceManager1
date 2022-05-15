/*
    -  
*/

const Joi  = require('@hapi/joi');
const registerValidation = (data)=>{
    const schema = Joi.object( {

        name: Joi.string().min(1).required(),
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()
    
    });

    return schema.validate(data)
};

const loginValidation = (data)=>{
    const schema = Joi.object({

        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()

    });
    return schema.validate(data)
};

const addPasswordManuallyValidation = (data)=>{

    const schema = Joi.object({
        
        passwordTitle: Joi.string().min(6).required(),
        password: Joi.string().required().min(8)

    });
    return schema.validate(data)
}

const addPasswordGenerationValidation = (data)=>{
    
    const schema = Joi.object({
        
        passwordTitle: Joi.string().min(6).required(),

    });
    return schema.validate(data)
}

module.exports.addPasswordGenerationValidation = addPasswordGenerationValidation,
module.exports.addPasswordManuallyValidation = addPasswordManuallyValidation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;