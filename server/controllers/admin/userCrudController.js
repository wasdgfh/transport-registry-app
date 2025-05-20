const { User } = require('../../models/associations');
const ApiError = require("../../error/ApiError");

class UserCrudController {
    async getAllUser(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async createUser(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateUser(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async deleteUser(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new UserCrudController();