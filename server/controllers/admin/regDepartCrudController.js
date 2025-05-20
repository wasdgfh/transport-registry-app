const { RegistrationDepart } = require('../../models/associations');
const ApiError = require("../../error/ApiError");

class RegDepartCrudController {
    async getAllRegDepart(req, res, next){
        try {
            const regDeparts = await RegistrationDepart.findAll();
            return res.json(regDeparts);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async createRegDepart(req, res, next){
        try {
            const {
                unitCode,
                departmentName
            } = req.body;
            const regDepart = await RegistrationDepart.create({
                unitCode,
                departmentName
            });
            return res.json(regDepart);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateRegDepart(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async deleteRegDepart(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new RegDepartCrudController();