const { Owner, NaturalPerson, LegalEntity, RegistrationDoc } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');
const sequelize = require('../../db');

const naturalPersonPutSchema = Joi.object({    
    address: Joi.string().min(8).max(255).required(),
    lastName: Joi.string().pattern(/^[А-Яа-яЁё\s\-]+$/).min(2).max(50).required(),
    firstName: Joi.string().pattern(/^[А-Яа-яЁё\s\-]+$/).min(2).max(50).required(),
    patronymic: Joi.string().pattern(/^[А-Яа-яЁё\s\-]+$/).min(2).max(50).required()
});

const naturalPersonPatchSchema = Joi.object({
    address: Joi.string().min(8).max(255),
    lastName: Joi.string().pattern(/^[А-Яа-яЁё\s\-]+$/).min(2).max(50),
    firstName: Joi.string().pattern(/^[А-Яа-яЁё\s\-]+$/).min(2).max(50),
    patronymic: Joi.string().pattern(/^[А-Яа-яЁё\s\-]+$/).min(2).max(50)
}).min(1);

const legalEntityPutSchema = Joi.object({
    address: Joi.string().min(8).max(255).required(),
    companyName: Joi.string().min(3).max(100).required()
});

const legalEntityPatchSchema = Joi.object({
    address: Joi.string().min(8).max(255),
    companyName: Joi.string().min(3).max(100)
}).min(1);

class OwnerController {

    async getNaturalPersonByPassport(req, res, next) {
        try {
            const { passport } = req.params;

            if (!/^\d{4} \d{6}$/.test(passport)) {
                throw ApiError.badRequest('Invalid passport format (should be "XXXX XXXXXX")');
            }

            const person = await NaturalPerson.findOne({
                where: { passportData: passport },
                attributes: ['passportData', 'lastName', 'firstName', 'patronymic', 'address']
            });

            if (!person) {
                throw ApiError.notFound('Natural person not found');
            }
            res.json(person);
        } catch (e) {
            console.error("GET BY PASSPORT ERROR:", e);
            next(e);
        }
    }

    async updateNaturalPerson(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { passport } = req.params;
            const { error } = naturalPersonPutSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const person = await NaturalPerson.findByPk(passport, { transaction });
            if (!person) throw ApiError.notFound('Natural person not found');

            const hasDocs = await RegistrationDoc.findOne({
                where: { ownerPassport: passport },
                transaction
            });

            if (hasDocs) {
                const restricted = ['lastName', 'firstName', 'patronymic'];
                for (const field of restricted) {
                    if (req.body[field] && req.body[field] !== person[field]) {
                        throw ApiError.badRequest(`Cannot change ${field} for owner with registration documents`);
                    }
                }
            }

            const oldAddress = person.address;
            const newAddress = req.body.address;

            if (newAddress !== oldAddress) {
                let newOwner = await Owner.findOne({ where: { address: newAddress }, transaction });

                if (!newOwner) {                    
                    newOwner = await Owner.create({ address: newAddress }, { transaction });
                }

                await RegistrationDoc.update(
                    { address: newAddress },
                    { where: { address: oldAddress }, transaction }
                );

                const linkedNaturalPersonCount = await NaturalPerson.count({ where: { address: oldAddress }, transaction });
                const linkedLegalEntityCount = await LegalEntity.count({ where: { address: oldAddress }, transaction });
                const linkedRegDocsCount = await RegistrationDoc.count({ where: { address: oldAddress }, transaction });

                if (linkedNaturalPersonCount === 0 && linkedLegalEntityCount === 0 && linkedRegDocsCount === 0) {
                    await Owner.destroy({ where: { address: oldAddress }, transaction });
                }
            }

            await person.update(req.body, { transaction });

            await transaction.commit();
            res.json(person);
        } catch (e) {
            await transaction.rollback();
            console.error('UPDATE ERROR:', e);
            next(e);
        }
    }

    async patchNaturalPerson(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            const { passport } = req.params;
            const { error, value } = naturalPersonPatchSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const person = await NaturalPerson.findByPk(passport, { transaction });
            if (!person) {
                throw ApiError.notFound('Natural person not found');
            }

            const hasDocs = await RegistrationDoc.findOne({
                where: { ownerPassport: passport },
                transaction
            });

            const restricted = ['lastName', 'firstName', 'patronymic'];

            if (hasDocs) {
                for (const field of restricted) {
                    if (value[field] && value[field] !== person[field]) {
                        throw ApiError.badRequest(`Cannot change ${field} for owner with registration documents`);
                    }
                }
            }

            if (value.address && value.address !== person.address) {
                const oldAddress = person.address;
                const newAddress = value.address;

                let newOwner = await Owner.findOne({ where: { address: newAddress }, transaction });
                if (!newOwner) {
                    newOwner = await Owner.create({ address: newAddress }, { transaction });
                }

                await RegistrationDoc.update(
                    { address: newAddress },
                    { where: { address: oldAddress }, transaction }
                );

                const linkedNaturalPersonCount = await NaturalPerson.count({ where: { address: oldAddress }, transaction });
                const linkedLegalEntityCount = await LegalEntity.count({ where: { address: oldAddress }, transaction });
                const linkedRegDocsCount = await RegistrationDoc.count({ where: { address: oldAddress }, transaction });

                if (linkedNaturalPersonCount === 0 && linkedLegalEntityCount === 0 && linkedRegDocsCount === 0) {
                    await Owner.destroy({ where: { address: oldAddress }, transaction });
                }
            }

            await person.update(value, { transaction });

            await transaction.commit();
            res.json(person);
        } catch (e) {
            await transaction.rollback();
            console.error("PATCH ERROR:", e);
            next(e);
        }
    }

    async getLegalEntitiesByTax(req, res, next) {
        try {
            const { tax } = req.params;

            if (!/^\d{10}$/.test(tax)) {
                throw ApiError.badRequest('Invalid tax number format (should be 10 digits)');
            }

            const entity = await LegalEntity.findOne({
                where: { taxNumber: tax },
                attributes: ['taxNumber', 'companyName', 'address']
            });

            if (!entity) {
                throw ApiError.notFound('Legal entity not found');
            }

            res.json(entity);
        } catch (e) {
            console.error("GET BY TAX ERROR:", e);
            next(e);
        }
    }

    async updateLegalEntity(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { tax } = req.params;
            const { error } = legalEntityPutSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const entity = await LegalEntity.findByPk(tax, { transaction });
            if (!entity) throw ApiError.notFound('Legal entity not found');

            const hasDocs = await RegistrationDoc.findOne({
                where: { ownerTaxNumber: tax },
                transaction
            });

            if (hasDocs && req.body.companyName && req.body.companyName !== entity.companyName) {
                throw ApiError.badRequest('Cannot change company name for legal entity with registration documents');
            }

            const oldAddress = entity.address;
            const newAddress = req.body.address;

            if (newAddress !== oldAddress) {
                let newOwner = await Owner.findOne({ where: { address: newAddress }, transaction });

                if (!newOwner) {
                    newOwner = await Owner.create({ address: newAddress }, { transaction });
                }

                await RegistrationDoc.update(
                    { address: newAddress },
                    { where: { address: oldAddress }, transaction }
                );

                const linkedNaturalPersonCount = await NaturalPerson.count({ where: { address: oldAddress }, transaction });
                const linkedLegalEntityCount = await LegalEntity.count({ where: { address: oldAddress }, transaction });
                const linkedRegDocsCount = await RegistrationDoc.count({ where: { address: oldAddress }, transaction });

                if (linkedNaturalPersonCount === 0 && linkedLegalEntityCount === 0 && linkedRegDocsCount === 0) {
                    await Owner.destroy({ where: { address: oldAddress }, transaction });
                }
            }

            await entity.update(req.body, { transaction });

            await transaction.commit();
            res.json(entity);
        } catch (e) {
            await transaction.rollback();
            console.error('UPDATE ERROR:', e);
            next(e);
        }
    }

    async patchLegalEntity(req, res, next) {
        const transaction = await sequelize.transaction();

        try {
            const { tax } = req.params;
            const { error, value } = legalEntityPatchSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const entity = await LegalEntity.findByPk(tax, { transaction });
            if (!entity) {
                throw ApiError.notFound('Legal entity not found');
            }

            const hasDocs = await RegistrationDoc.findOne({
                where: { ownerTaxNumber: tax },
                transaction
            });

            if (hasDocs && value.companyName && value.companyName !== entity.companyName) {
                throw ApiError.badRequest('Cannot change company name for legal entity with registration documents');
            }

            // Обработка смены адреса, если адрес изменён
            if (value.address && value.address !== entity.address) {
                const oldAddress = entity.address;
                const newAddress = value.address;

                let newOwner = await Owner.findOne({ where: { address: newAddress }, transaction });
                if (!newOwner) {
                    newOwner = await Owner.create({ address: newAddress }, { transaction });
                }

                await RegistrationDoc.update(
                    { address: newAddress },
                    { where: { address: oldAddress }, transaction }
                );

                const linkedNaturalPersonCount = await NaturalPerson.count({ where: { address: oldAddress }, transaction });
                const linkedLegalEntityCount = await LegalEntity.count({ where: { address: oldAddress }, transaction });
                const linkedRegDocsCount = await RegistrationDoc.count({ where: { address: oldAddress }, transaction });

                if (linkedNaturalPersonCount === 0 && linkedLegalEntityCount === 0 && linkedRegDocsCount === 0) {
                    await Owner.destroy({ where: { address: oldAddress }, transaction });
                }
            }

            await entity.update(value, { transaction });

            await transaction.commit();
            res.json(entity);
        } catch (e) {
            await transaction.rollback();
            console.error("PATCH ERROR:", e);
            next(e);
        }
    }
}

module.exports = new OwnerController();