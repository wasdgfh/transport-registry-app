const { TransportVehicle } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');
const sequelize = require('../../db');
const { vehicleCreateSchema } = require('../../validations/vehicleShema');

class VehicleController {
    async getMyVehicles(req, res, next) {
        
    }

    async getMyVehicleByVin(req, res, next) {
        
    }

    async createVehicle(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            const { error } = vehicleCreateSchema.validate(req.body);
            if (error) {
                throw ApiError.badRequest(error.details[0].message);
            }

            const { vin } = req.body;

            const existingVehicle = await TransportVehicle.findOne({
                where: { vin },
                transaction
            });

            if (existingVehicle) {
                throw ApiError.conflict('Vehicle with this VIN already exists');
            }

            const vehicleData = {
                ...req.body,
                bodyNumber: vin.slice(-6),
                chassisNumber: req.body.hasChassisNumber ? vin : null 
            };

            const vehicle = await TransportVehicle.create(vehicleData, {
                transaction
            });

            await transaction.commit();
            return res.status(201).json({
                message: 'Vehicle created successfully',
                data: vehicle
            });
        } catch (e) {
            await transaction.rollback();
            console.error('Error in createVehicle:', e);
            next(e);
        }
    }
}

module.exports = new VehicleController();