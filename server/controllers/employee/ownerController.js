const { NaturalPerson, LegalEntity } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');

const naturalPersonSchema = Joi.object({
    passportData: Joi.string().pattern(/^[A-Z0-9]{10}$/).required(),
    address: Joi.string().min(5).max(255).required(),
    lastName: Joi.string().min(2).max(50).required(),
    firstName: Joi.string().min(2).max(50).required(),
    patronymic: Joi.string().min(2).max(50).required()
});

const legalEntitySchema = Joi.object({
    taxNumber: Joi.string().pattern(/^[A-Z0-9]{10,15}$/).required(),
    address: Joi.string().min(5).max(255).required(),
    companyName: Joi.string().min(3).max(100).required()
});

class OwnerController {
    async getNaturalPersonById(req, res, next) {
        try {
            const { id } = req.params;

            if (!/^[A-Z0-9]{10}$/.test(id)) {
                throw ApiError.badRequest('Invalid passport format');
            }

            const person = await NaturalPerson.findOne({
                where: { passportData: id },
                attributes: ['passportData', 'lastName', 'firstName', 'patronymic', 'address']
            });

            if (!person) {
                throw ApiError.notFound('Owner not found');
            }

            res.json(person);
        } catch (e) {
            next(e);
        }
    }

    async updateNaturalPerson(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = naturalPersonSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            if (req.body.passportData && req.body.passportData !== id) {
                throw ApiError.badRequest('Cannot change passport data');
            }

            const [affectedCount] = await NaturalPerson.update(req.body, {
                where: { passportData: id },
                returning: true
            });

            if (affectedCount === 0) {
                throw ApiError.notFound('Owner not found');
            }

            const updatedPerson = await NaturalPerson.findByPk(id);
            res.json(updatedPerson);
        } catch (e) {
            next(e);
        }
    }

    async getLegalEntitiesById(req, res, next) {
        try {
            const { id } = req.params;

            if (!/^[A-Z0-9]{10,15}$/.test(id)) {
                throw ApiError.badRequest('Invalid tax number format');
            }

            const entity = await LegalEntity.findOne({
                where: { taxNumber: id },
                attributes: ['taxNumber', 'companyName', 'address']
            });

            if (!entity) {
                throw ApiError.notFound('Legal entity not found');
            }

            res.json(entity);
        } catch (e) {
            next(e);
        }
    }

    async updateLegalEntities(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = legalEntitySchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            if (req.body.taxNumber && req.body.taxNumber !== id) {
                throw ApiError.badRequest('Cannot change tax number');
            }

            const [affectedCount] = await LegalEntity.update(req.body, {
                where: { taxNumber: id },
                returning: true
            });

            if (affectedCount === 0) {
                throw ApiError.notFound('Legal entity not found');
            }

            const updatedEntity = await LegalEntity.findByPk(id);
            res.json(updatedEntity);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new OwnerController();