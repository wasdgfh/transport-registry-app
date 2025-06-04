const { Work, RegistrationOp, Employee } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');
const sequelize = require('../../db');
const { workSchema, workPatchShema } = require('../../validations/workShema');

class WorkController {
    async getAllWork(req, res, next) {
        try {
            const schema = Joi.object({
                limit: Joi.number().integer().min(1).max(100).default(20),
                page: Joi.number().integer().min(1).default(1)
            });

            const { value, error } = schema.validate(req.query);

            if (error) throw ApiError.badRequest(error.details[0].message);

            const { limit, page } = value;
            const offset = (page - 1) * limit;

            const user = req.user;
            if (user.role !== 'EMPLOYEE') throw ApiError.forbidden('Only employees can view work records');
            const badgeNumber = user.badgeNumber;
            if (!badgeNumber) throw ApiError.forbidden('Employee badge number is missing');

            const { count, rows } = await Work.findAndCountAll({
                where: { badgeNumber },
                limit,
                offset,
                include: [
                    {
                        model: RegistrationOp,
                        attributes: ['operationId', 'operationType', 'operationDate', 'vin'],
                        required: true
                    },
                    {
                        model: Employee,
                        attributes: ['badgeNumber', 'firstName', 'lastName'],
                        required: true
                    }
                ],
                order: [[sequelize.col('registrationop.operationDate'), 'DESC']],        
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            });

            res.json({
                total: count,
                pages: Math.ceil(count / limit),
                currentPage: page,
                data: rows
            });
        } catch (e) {
            console.error('GET ALL WORK ERROR:', e);
            next(ApiError.internal(e.message));
        }
    }

    async createWork(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            const { error } = workSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const { operationId, purpose } = req.body;

            const user = req.user;
            if (user.role !== 'EMPLOYEE') throw ApiError.forbidden('Only employees can create work records');
            const badgeNumber = user.badgeNumber;
            if (!badgeNumber) throw ApiError.forbidden('Employee badge number is missing');
            
            const operation = await RegistrationOp.findByPk(operationId, { transaction });
            if (!operation) {
                throw ApiError.badRequest('Operation does not exist');
            }

            const existingWork = await Work.findOne({
                where: { badgeNumber, operationId },
                transaction
            });

            if (existingWork) {
                throw ApiError.conflict('Work record already exists for this operation');
            }

            const newWork = await Work.create({
                badgeNumber,
                operationId,
                purpose
                }, 
                { transaction }
            );

            await transaction.commit();
            res.status(201).json(newWork);
        } catch (e) {
            await transaction.rollback();
            console.error('CREATE WORK ERROR:', e);
            next(e);
        }
    }

    async patchWork(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;
            const { error } = workPatchShema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const user = req.user;
            if (user.role !== 'EMPLOYEE') throw ApiError.forbidden('Only employees can edit work records');
            const badgeNumber = user.badgeNumber;
            if (!badgeNumber) throw ApiError.forbidden('Employee badge number is missing');

            const work = await Work.findOne({ 
                where: { badgeNumber, operationId: id },
                transaction
            });

            if (!work) {
                throw ApiError.notFound('Work record not found or does not belong to you');
            }

            await work.update(
                { purpose: req.body.purpose },
                {
                    transaction,
                    fields: ['purpose']
                }
            );

            await transaction.commit();
            res.json(work);
        } catch (e) {
            await transaction.rollback();
            console.error('PATCH WORK ERROR:', e);
            next(e.message);
        }
    }
}

module.exports = new WorkController();