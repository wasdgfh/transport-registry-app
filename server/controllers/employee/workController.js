const { Work } = require('../../models/associations');
const ApiError = require("../../error/ApiError");

class WorkController {
    async getAllWork(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async createWork(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateWork(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new WorkController();