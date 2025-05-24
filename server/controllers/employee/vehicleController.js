const { TransportVehicle } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');

const vehicleSchema = Joi.object({
    vin: Joi.string().pattern(/^[A-Z0-9]{17}$/).required(),
    makeAndModel: Joi.string().min(2).max(100).required(),
    releaseYear: Joi.string().pattern(/^(19|20)\d{2}$/).required(),
    manufacture: Joi.string().min(2).max(100).required(),
    typeOfDrive: Joi.string().valid('FWD', 'RWD', 'AWD', '4WD').required(),
    power: Joi.string().pattern(/^\d+\s*(hp|kW)$/).required(),
    chassisNumber: Joi.string().min(5).max(50).required(),
    bodyNumber: Joi.string().min(5).max(50).required(),
    bodyColor: Joi.string().min(2).max(50).required(),
    transmissionType: Joi.string().valid('manual', 'automatic', 'CVT', 'semi-automatic').required(),
    steeringWheel: Joi.string().valid('left', 'right').required(),
    engineModel: Joi.string().min(2).max(50).required(),
    engineVolume: Joi.number().integer().min(500).max(10000).required()
});

class TransportVehicleController {
    async getAllTransportVehicle(req, res, next) {
        try {
            const { error } = Joi.object({
                limit: Joi.number().integer().min(1).max(100).default(20),
                page: Joi.number().integer().min(1).default(1),
                makeAndModel: Joi.string().optional(),
                releaseYear: Joi.string().pattern(/^(19|20)\d{2}$/).optional(),
                bodyColor: Joi.string().optional(),
                typeOfDrive: Joi.string().valid('FWD', 'RWD', 'AWD', '4WD').optional()
            }).validate(req.query);

            if (error) throw ApiError.badRequest(error.details[0].message);

            const { limit, page, makeAndModel, releaseYear, bodyColor, typeOfDrive } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (makeAndModel) where.makeAndModel = { [Op.like]: `%${makeAndModel}%` };
            if (releaseYear) where.releaseYear = releaseYear;
            if (bodyColor) where.bodyColor = { [Op.like]: `%${bodyColor}%` };
            if (typeOfDrive) where.typeOfDrive = typeOfDrive;

            const { count, rows } = await TransportVehicle.findAndCountAll({
                where,
                limit,
                offset,
                order: [['makeAndModel', 'ASC']],
                attributes: [
                    'vin', 'makeAndModel', 'releaseYear', 'bodyColor',
                    'typeOfDrive', 'transmissionType', 'engineVolume'
                ]
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

    async getTransportVehicleById(req, res, next) {
        try {
            const { id } = req.params;

            if (!/^[A-Z0-9]{17}$/.test(id)) {
                throw ApiError.badRequest('Invalid VIN format');
            }

            const vehicle = await TransportVehicle.findByPk(id, {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            });

            if (!vehicle) {
                throw ApiError.notFound('Vehicle not found');
            }

            res.json(vehicle);
        } catch (e) {
            next(e);
        }
    }

    async updateTransportVehicle(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = vehicleSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            if (req.body.vin && req.body.vin !== id) {
                throw ApiError.badRequest('Cannot change VIN');
            }

            const vehicle = await TransportVehicle.findByPk(id);
            if (!vehicle) {
                throw ApiError.notFound('Vehicle not found');
            }

            await vehicle.update(req.body, {
                fields: [
                    'makeAndModel', 'releaseYear', 'manufacture', 'typeOfDrive', 'power',
                    'chassisNumber', 'bodyNumber', 'bodyColor', 'transmissionType',
                    'steeringWheel', 'engineModel', 'engineVolume'
                ]
            });

            res.json(vehicle);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TransportVehicleController();