const { Owner, NaturalPerson, LegalEntity, RegistrationDoc } = require('../models/associations');
const ApiError = require('../error/ApiError');
const Joi = require('joi');
const sequelize = require('../db');

const naturalPersonSchema = Joi.object({
    isNaturalPerson: Joi.boolean().required(),
    passportData: Joi.string().pattern(/^\d{4} \d{6}$/).required()
        .messages({ 'string.pattern.base': 'passportData must match format "1234 567890"' }),
    address: Joi.string().min(8).max(255).required(),
    lastName: Joi.string().pattern(/^[А-Яа-яЁё\s\-]+$/).min(2).max(50).required(),
    firstName: Joi.string().pattern(/^[А-Яа-яЁё\s\-]+$/).min(2).max(50).required(),
    patronymic: Joi.string().pattern(/^[А-Яа-яЁё\s\-]+$/).min(2).max(50).required()
});

const legalEntitySchema = Joi.object({
    isNaturalPerson: Joi.boolean().required(),
    taxNumber: Joi.string().pattern(/^\d{10}$/).required()
        .messages({ 'string.pattern.base': 'taxNumber must contain exactly 10 digits' }),
    address: Joi.string().min(8).max(255).required(),
    companyName: Joi.string().min(3).max(100).required()
});

class UserController {
    async createNaturalPerson(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { error, value } = naturalPersonSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const { passportData, address, lastName, firstName, patronymic } = value;

            const existingPerson = await NaturalPerson.findOne({
                where: { passportData },
                transaction
            });
            if (existingPerson) {
                throw ApiError.conflict('Natural person with this passport already exists');
            }

            let owner = await Owner.findOne({ where: { address }, transaction });
            if (!owner) {
                owner = await Owner.create({ address }, { transaction });
            }

            const naturalPerson = await NaturalPerson.create({
                passportData,
                address,
                lastName,
                firstName,
                patronymic
            }, { transaction });

            await transaction.commit();
            res.status(201).json(naturalPerson);
        } catch (e) {
            await transaction.rollback();
            console.error('CREATE NATURAL PERSON ERROR:', e);
            next(e);
        }
    }

    async createLegalEntity(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { error, value } = legalEntitySchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const { taxNumber, address, companyName } = value;

            const existingEntity = await LegalEntity.findOne({
                where: { taxNumber },
                transaction
            });
            if (existingEntity) {
                throw ApiError.conflict('Legal entity with this tax number already exists');
            }

            let owner = await Owner.findOne({ where: { address }, transaction });
            if (!owner) {
                owner = await Owner.create({ address }, { transaction });
            }

            const legalEntity = await LegalEntity.create({
                taxNumber,
                address,
                companyName
            }, { transaction });

            await transaction.commit();
            res.status(201).json(legalEntity);
        } catch (e) {
            await transaction.rollback();
            console.error('CREATE LEGAL ENTITY ERROR:', e);
            next(e);
        }
    }

    async registration(req, res){

    }

    async login(req, res){


    }

    async check(req, res, next){

    }

    async deleteNaturalPerson(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { passportData } = req.params;

            if (!/^\d{4} \d{6}$/.test(passportData)) {
                throw ApiError.badRequest('Invalid passport format (should be "XXXX XXXXXX")');
            }

            const person = await NaturalPerson.findOne({
                where: { passportData },
                transaction
            });

            if (!person) {
                throw ApiError.notFound('Natural person not found');
            }

            const address = person.address;

            await person.destroy({ transaction });

            const linkedNaturalPersonCount = await NaturalPerson.count({ 
                where: { address }, 
                transaction 
            });
            const linkedLegalEntityCount = await LegalEntity.count({ 
                where: { address }, 
                transaction 
            });
            const linkedRegDocsCount = await RegistrationDoc.count({ 
                where: { address }, 
                transaction 
            });

            if (linkedNaturalPersonCount === 0 && linkedLegalEntityCount === 0 && linkedRegDocsCount === 0) {
                await Owner.destroy({ 
                    where: { address }, 
                    transaction 
                });
            }

            await transaction.commit();
            res.status(204).send();
        } catch (e) {
            await transaction.rollback();
            console.error('DELETE NATURAL PERSON ERROR:', e);
            next(e);
        }
    }

    async deleteLegalEntity(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { taxNumber } = req.params;

            if (!/^\d{10}$/.test(taxNumber)) {
                throw ApiError.badRequest('Invalid tax number format (should be 10 digits)');
            }

            const entity = await LegalEntity.findOne({
                where: { taxNumber },
                transaction
            });

            if (!entity) {
                throw ApiError.notFound('Legal entity not found');
            }

            const address = entity.address;

            await entity.destroy({ transaction });

            const linkedNaturalPersonCount = await NaturalPerson.count({ 
                where: { address }, 
                transaction 
            });
            const linkedLegalEntityCount = await LegalEntity.count({ 
                where: { address }, 
                transaction 
            });
            const linkedRegDocsCount = await RegistrationDoc.count({ 
                where: { address }, 
                transaction 
            });

            if (linkedNaturalPersonCount === 0 && linkedLegalEntityCount === 0 && linkedRegDocsCount === 0) {
                await Owner.destroy({ 
                    where: { address }, 
                    transaction 
                });
            }

            await transaction.commit();
            res.status(204).send();
        } catch (e) {
            await transaction.rollback();
            console.error('DELETE LEGAL ENTITY ERROR:', e);
            next(e);
        }
    }
}

module.exports = new UserController();