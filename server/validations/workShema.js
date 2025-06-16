const Joi = require('joi');

const workSchema = Joi.object({
    operationId: Joi.number().integer().min(1).required(), 
    purpose: Joi.string().min(5).max(255).required(),
    workDate: Joi.date().required()
});

const workPatchShema = Joi.object({
    purpose: Joi.string().min(5).max(255),
    workDate: Joi.date()
}).min(1);


module.exports = {
    workSchema,
    workPatchShema
};