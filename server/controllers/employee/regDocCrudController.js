const { RegistrationDoc } = require('../../models/associations');
const ApiError = require("../../error/ApiError");

class RegDocCrudController {
    async getAllRegDoc(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async getRegDocById(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async createRegDoc(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateRegDoc(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new RegDocCrudController();