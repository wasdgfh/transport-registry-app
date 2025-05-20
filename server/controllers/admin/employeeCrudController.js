const { Employee } = require('../../models/associations');
const ApiError = require("../../error/ApiError");

class EmployeeCrudController {
    async getAllEmployees(req, res, next){
        try {
            const employees = await Employee.findAll();
            return res.json(employees);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async createEmployee(req, res, next){
        try {
            const {
                badgeNumber,
                unitCode,
                lastName,
                firstName,
                patronymic,
                rank
            } = req.body;
            const employee = await Employee.create({
                badgeNumber,
                unitCode,
                lastName,
                firstName,
                patronymic,
                rank
            });
            return res.json(employee);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async updateEmployee(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async deleteEmployee(req, res, next){
        try {

        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new EmployeeCrudController();