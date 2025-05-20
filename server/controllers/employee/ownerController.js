const { NaturalPerson, LegalEntity } = require('../../models/associations');
const ApiError = require("../../error/ApiError");

class OwnerController {
    async getNaturalPersonById(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateNaturalPerson(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async getLegalEntitiesById(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateLegalEntities(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new OwnerController();