const { RegistrationOp } = require('../../models/associations');
const ApiError = require("../../error/ApiError");

class RegOpController {
    async getAllRegOp(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async getRegOpById(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateRegOp(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new RegOpController();