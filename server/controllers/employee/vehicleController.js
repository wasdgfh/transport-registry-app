const { TransportVehicle } = require('../../models/associations');
const ApiError = require("../../error/ApiError");

class TransportVehicleController {
    async getAllTransportVehicle(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async getTransportVehicleById(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateTransportVehicle(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new TransportVehicleController();