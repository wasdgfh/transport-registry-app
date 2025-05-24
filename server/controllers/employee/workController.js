const { Work, RegistrationOp, Employee } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');

const workSchema = Joi.object({
    badgeNumber: Joi.string().pattern(/^[A-Z0-9]{5,10}$/).required(),
    operationId: Joi.number().integer().min(1).required(),
    purpose: Joi.string().min(5).max(255).required()
});

class WorkController {
    async getAllWork(req, res, next) {
        try {
            const { error } = Joi.object({
                limit: Joi.number().integer().min(1).max(100).default(20),
                page: Joi.number().integer().min(1).default(1),
                badgeNumber: Joi.string().pattern(/^[A-Z0-9]{5,10}$/).optional(),
                operationId: Joi.number().integer().min(1).optional()
            }).validate(req.query);

            if (error) throw ApiError.badRequest(error.details[0].message);

            const { limit, page, badgeNumber, operationId } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (badgeNumber) where.badgeNumber = badgeNumber;
            if (operationId) where.operationId = operationId;

            const { count, rows } = await Work.findAndCountAll({
                where,
                limit,
                offset,
                include: [
                    {
                        model: RegistrationOp,
                        attributes: ['operationId', 'operationType', 'operationDate']
                    },
                    {
                        model: Employee,
                        attributes: ['badgeNumber', 'firstName', 'lastName']
                    }
                ],
                order: [['badgeNumber', 'ASC'], ['operationId', 'ASC']],
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            });

            res.json({
                total: count,
                pages: Math.ceil(count / limit),
                currentPage: +page,
                data: rows
            });
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async createWork(req, res, next) {
        try {
            const { error } = workSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const { badgeNumber, operationId } = req.body;

            // Проверка существования операции и сотрудника
            const [operation, employee] = await Promise.all([
                RegistrationOp.findByPk(operationId),
                Employee.findOne({ where: { badgeNumber } })
            ]);

            if (!operation) throw ApiError.badRequest('Operation does not exist');
            if (!employee) throw ApiError.badRequest('Employee does not exist');

            const existingWork = await Work.findOne({
                where: { badgeNumber, operationId }
            });

            if (existingWork) {
                throw ApiError.conflict('Work record already exists for this employee and operation');
            }

            const newWork = await Work.create(req.body, {
                returning: true,
                fields: ['badgeNumber', 'operationId', 'purpose']
            });

            res.status(201).json(newWork);
        } catch (e) {
            next(e);
        }
    }

    async updateWork(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = workSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            if (req.body.operationId && req.body.operationId !== +id) {
                throw ApiError.badRequest('Cannot change operation ID');
            }

            const work = await Work.findOne({ where: { operationId: id } });
            if (!work) {
                throw ApiError.notFound('Work record not found');
            }

            await work.update(req.body, {
                fields: ['badgeNumber', 'purpose']
            });

            res.json(work);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new WorkController();