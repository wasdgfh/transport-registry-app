const { RegistrationOp, Employee } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');

const regOpSchema = Joi.object({
    vin: Joi.string().pattern(/^[A-Z0-9]{17}$/).required(),
    registrationNumber: Joi.string().pattern(/^[A-Z0-9]{8,20}$/).optional(),
    unitCode: Joi.string().min(3).max(50).required(),
    operationType: Joi.string().valid('registration', 'deregistration', 'change').required(),
    operationBase: Joi.string().min(5).max(255).required(),
    operationDate: Joi.date().iso().required()
});

class RegOpController {
    async getAllRegOp(req, res, next) {
        try {
            const { error } = Joi.object({
                limit: Joi.number().integer().min(1).max(100).default(20),
                page: Joi.number().integer().min(1).default(1),
                vin: Joi.string().pattern(/^[A-Z0-9]{17}$/).optional(),
                operationType: Joi.string().valid('registration', 'deregistration', 'change').optional(),
                startDate: Joi.date().iso().optional(),
                endDate: Joi.date().iso().optional()
            }).validate(req.query);

            if (error) throw ApiError.badRequest(error.details[0].message);

            const { limit, page, vin, operationType, startDate, endDate } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (vin) where.vin = vin;
            if (operationType) where.operationType = operationType;
            if (startDate && endDate) {
                where.operationDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
            }

            const { count, rows } = await RegistrationOp.findAndCountAll({
                where,
                limit,
                offset,
                include: [{
                    model: Employee,
                    attributes: ['badgeNumber', 'firstName', 'lastName']
                }],
                order: [['operationDate', 'DESC']],
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

    async getRegOpById(req, res, next) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(+id)) {
                throw ApiError.badRequest('Invalid operation ID');
            }

            const operation = await RegistrationOp.findByPk(id, {
                include: [{
                    model: Employee,
                    attributes: ['badgeNumber', 'firstName', 'lastName']
                }]
            });

            if (!operation) {
                throw ApiError.notFound('Operation not found');
            }

            res.json(operation);
        } catch (e) {
            next(e);
        }
    }

    async updateRegOp(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = regOpSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const operation = await RegistrationOp.findByPk(id);
            if (!operation) {
                throw ApiError.notFound('Operation not found');
            }

            await operation.update(req.body, {
                fields: ['vin', 'registrationNumber', 'unitCode', 'operationType', 'operationBase', 'operationDate']
            });

            res.json(operation);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new RegOpController();