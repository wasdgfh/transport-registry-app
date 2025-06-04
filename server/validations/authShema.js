const Joi = require('joi');

const ownerRegistrationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('OWNER').required(),
    passportData: Joi.string().when('isNaturalPerson', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.forbidden()
    }),
    taxNumber: Joi.string().when('isNaturalPerson', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.forbidden()
    }),
    isNaturalPerson: Joi.boolean().required()
});

const employeeRegistrationSchema = Joi.object({
    badgeNumber: Joi.string().required()
});


module.exports = {
    ownerRegistrationSchema,
    employeeRegistrationSchema
};