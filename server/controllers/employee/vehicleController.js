const { TransportVehicle } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');
const sequelize = require('../../db');
const { vehicleUpdateSchema, vehiclePatchSchema } = require('../../validations/vehicleShema');

class TransportVehicleController {
    async getAllTransportVehicle(req, res, next) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'DESC',
                search = ''
            } = req.query;

            const allowedSortFields = [
                'vin',
                'makeAndModel',
                'releaseYear',
                'manufacture',
                'typeOfDrive',
                'power',
                'chassisNumber',
                'bodyNumber',
                'bodyColor',
                'transmissionType',
                'steeringWheel',
                'engineModel',
                'engineVolume',
                'createdAt',
                'updatedAt'
            ];

            if (!allowedSortFields.includes(sortBy)) {
                throw ApiError.badRequest('Invalid sort field');
            }

            if (!['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
                throw ApiError.badRequest('Invalid sort order');
            }

            const offset = (page - 1) * limit;

            const where = {};
            if (search) {
                where[Op.or] = [
                    { makeAndModel: { [Op.iLike]: `%${search}%` } },
                    { vin: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const order = sortBy === 'power'
                ? sequelize.literal(`CAST(REGEXP_REPLACE(SPLIT_PART(power, '/', 2), '\\D', '', 'g') AS INTEGER) ${sortOrder}`)
                : [[sortBy, sortOrder.toUpperCase()]];
                
            const { count, rows } = await TransportVehicle.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order
            });

            res.json({
                data: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            });
        } catch (e) {
            console.error("GET ALL VEHICLES ERROR:", e);
            next(e);
        }
    }

    async getTransportVehicleByVin(req, res, next) {
        try {
            const { vin } = req.params;

            if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
                throw ApiError.badRequest('Неверный формат VIN. VIN должен содержать 17 символов и не может содержать буквы I, O, Q');
            }

            const vehicle = await TransportVehicle.findOne({
                where: { vin },
                attributes: [
                    'vin',
                    'makeAndModel',
                    'releaseYear',
                    'manufacture',
                    'typeOfDrive',
                    'power',
                    'chassisNumber',
                    'bodyNumber',
                    'bodyColor',
                    'transmissionType',
                    'steeringWheel',
                    'engineModel',
                    'engineVolume'
                ]
            });

            if (!vehicle) {
                throw ApiError.notFound('Транспортное средство не найдено');
            }

            return res.json({
                data: vehicle
            });
        } catch (e) {
            console.error("GET BY VIN ERROR:", e);
            next(e);
        }
    }

    async updateTransportVehicle(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            const { vin } = req.params;

            if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
                throw ApiError.badRequest('Неверный формат VIN. VIN должен содержать 17 символов и не может содержать буквы I, O, Q');
            }

            const { error } = vehicleUpdateSchema.validate(req.body);
            if (error) {
                throw ApiError.badRequest(error.details[0].message);
            }

            const vehicle = await TransportVehicle.findOne({
                where: { vin },
                transaction
            });

            if (!vehicle) {
                throw ApiError.notFound('Транспортное средство не найдено');
            }

            const updateData = {
                ...req.body,
                chassisNumber: req.body.hasChassisNumber ? vin : null
            };

            await vehicle.update(updateData, {
                transaction,
                fields: [
                    'makeAndModel',
                    'releaseYear',
                    'manufacture',
                    'typeOfDrive',
                    'power',
                    'bodyColor',
                    'transmissionType',
                    'steeringWheel',
                    'engineModel',
                    'engineVolume',
                    'chassisNumber'
                ]
            });

            await transaction.commit();

            const updatedVehicle = await TransportVehicle.findOne({
                where: { vin },
                attributes: [
                    'vin',
                    'makeAndModel',
                    'releaseYear',
                    'manufacture',
                    'typeOfDrive',
                    'power',
                    'chassisNumber',
                    'bodyNumber',
                    'bodyColor',
                    'transmissionType',
                    'steeringWheel',
                    'engineModel',
                    'engineVolume'
                ]
            });

            return res.json({
                message: 'Транспортное средство успешно обновлено',
                data: updatedVehicle
            });
        } catch (e) {
            await transaction.rollback();
            console.error("UPDATE VEHICLE ERROR:", e);
            next(e);
        }
    }

    async patchTransportVehicle(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            const { vin } = req.params;

            if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
                throw ApiError.badRequest('Неверный формат VIN. VIN должен содержать 17 символов и не может содержать буквы I, O, Q');
            }

            const { error } = vehiclePatchSchema.validate(req.body);
            if (error) {
                throw ApiError.badRequest(error.details[0].message);
            }

            const vehicle = await TransportVehicle.findOne({
                where: { vin },
                transaction
            });

            if (!vehicle) {
                throw ApiError.notFound('Транспортное средство не найдено');
            }

            const updateData = {
                ...req.body
            };

            if ('hasChassisNumber' in req.body) {
                updateData.chassisNumber = req.body.hasChassisNumber ? vin : null;
            }

            await vehicle.update(updateData, {
                transaction,
                fields: Object.keys(updateData).filter(field => [
                    'makeAndModel',
                    'releaseYear',
                    'manufacture',
                    'typeOfDrive',
                    'power',
                    'bodyColor',
                    'transmissionType',
                    'steeringWheel',
                    'engineModel',
                    'engineVolume',
                    'chassisNumber'
                ].includes(field))
            });

            await transaction.commit();

            const updatedVehicle = await TransportVehicle.findOne({
                where: { vin },
                attributes: [
                    'vin',
                    'makeAndModel',
                    'releaseYear',
                    'manufacture',
                    'typeOfDrive',
                    'power',
                    'chassisNumber',
                    'bodyNumber',
                    'bodyColor',
                    'transmissionType',
                    'steeringWheel',
                    'engineModel',
                    'engineVolume'
                ]
            });

            return res.json({
                message: 'Транспортное средство успешно обновлено',
                data: updatedVehicle
            });
        } catch (e) {
            await transaction.rollback();
            console.error("PATCH VEHICLE ERROR:", e);
            next(e);
        }
    }
}

module.exports = new TransportVehicleController();