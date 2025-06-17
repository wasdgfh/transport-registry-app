const { RegistrationDepart } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');

class RegDepartController {
    async getRegDepart(req, res, next) {
        try {
            const schema = Joi.object({
                limit: Joi.number().integer().min(1).max(100).default(20),
                page: Joi.number().integer().min(1).default(1),
                search: Joi.string().optional()
            });

            const { error, value } = schema.validate(req.query);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const { limit, page, search } = value;
            const offset = (page - 1) * limit;

            const where = {};
            if (search) {
                where[Op.or] = [
                    { departmentName: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows } = await RegistrationDepart.findAndCountAll({
                where,
                limit,
                offset,
                order: [['departmentName', 'ASC']],
                attributes: ['unitCode', 'departmentName', 'address']
            });

            res.json({
                total: count,
                pages: Math.ceil(count / limit),
                currentPage: page,
                data: rows
            });
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new RegDepartController();