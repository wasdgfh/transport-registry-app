const { RegistrationDepart, Employee } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');
const sequelize = require('../../db');

const regDepartSchema = Joi.object({
    unitCode: Joi.string().min(6).max(6).required(),
    departmentName: Joi.string().min(8).max(128).required(),
    address: Joi.string().min(8).max(255).required()    
});

const regDepartPatchSchema = Joi.object({
    departmentName: Joi.string().min(8).max(128),
    address: Joi.string().min(8).max(255)
});


class RegDepartCrudController {
    
    async getAllRegDepart(req, res, next) {
        try {
            const { error, value } = Joi.object({
                limit: Joi.number().integer().min(1).max(50).default(15),
                page: Joi.number().integer().min(1).default(1),
                search: Joi.string().optional()
            }).validate(req.query);

            if (error) throw ApiError.badRequest(error.details[0].message);

            const { limit, page, search } = value;
            const offset = (page - 1) * limit;

            const where = {};
            if (search) {
                where[Op.or] = [
                    { unitCode: { [Op.like]: `%${search}%` }},
                    { departmentName: { [Op.like]: `%${search}%` }},
                    { address: { [Op.like]: `%${search}%` }}
                ];
            }

            const { count, rows } = await RegistrationDepart.findAndCountAll({
                where,
                limit,
                offset,
                order: [['departmentName', 'ASC']]
            });

            res.json({
                total: count,
                pages: Math.ceil(count / limit),
                currentPage: +page,
                data: rows
            });
        } catch (e) {
            console.error("GET ALL ERROR:", e);
            next(ApiError.internal(e.message));
        }
    }

    async createRegDepart(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            const { error } = regDepartSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const { unitCode, departmentName, address } = req.body;

            const existing = await RegistrationDepart.findOne({
                where: {
                    [Op.or]: [
                        { unitCode },
                        { departmentName },
                        { address }
                    ]
                },
                transaction
            });

            if (existing) {
                throw ApiError.conflict('Department with this unit code, name, or address already exists');
            }

            const department = await RegistrationDepart.create(req.body, {
                transaction
            });

            await transaction.commit();
            res.status(201).json(department);
        } catch (e) {
            await transaction.rollback();
            console.error("CREATE ERROR:", e);
            next(ApiError.internal(e.message)); 
        }
    }

    async updateRegDepart(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;

            const { error, value } = regDepartSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const department = await RegistrationDepart.findByPk(id, { transaction });
            if (!department) {
                throw ApiError.notFound('Department not found');
            }

            const { unitCode, departmentName, address } = value;

            // Проверка на уникальность кода подразделения
            if (unitCode && unitCode !== department.unitCode) {
                const existing = await RegistrationDepart.findOne({
                    where: { unitCode },
                    transaction
                });
                if (existing) {
                    throw ApiError.conflict('Department with this unit code already exists');
                }
            }

            if (departmentName && departmentName !== department.departmentName) {
                const existing = await RegistrationDepart.findOne({
                    where: { departmentName },
                    transaction
                });
                if (existing) {
                    throw ApiError.conflict('Department with this name already exists');
                }
            }

            if (address && address !== department.address) {
                const existing = await RegistrationDepart.findOne({
                    where: { address },
                    transaction
                });
                if (existing) {
                    throw ApiError.conflict('Department with this address already exists');
                }
            }

            await department.update(value, { transaction });

            await transaction.commit();
            res.json(department);
        } catch (e) {
            await transaction.rollback();
            console.error('UPDATE ERROR:', e);
            next(ApiError.internal(e.message));
        }
    }

    async patchRegDepart(req, res, next) {
        const transaction = await sequelize.transaction();

        try {
            const { id } = req.params;

            const { error, value } = regDepartPatchSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            if (Object.keys(value).length === 0) {
                throw ApiError.badRequest('No data provided to update');
            }

            const department = await RegistrationDepart.findByPk(id, { transaction });
            if (!department) throw ApiError.notFound('Department not found');

            if (value.departmentName && value.departmentName !== department.departmentName) {
                const existing = await RegistrationDepart.findOne({
                    where: { departmentName: value.departmentName },
                    transaction
                });
                if (existing) throw ApiError.conflict('Department name already exists');
            }

            if (value.address && value.address !== department.address) {
                const existing = await RegistrationDepart.findOne({
                    where: { address: value.address },
                    transaction
                });
                if (existing) throw ApiError.conflict('Department address already exists');
            }

            await department.update(value, { transaction });
            await transaction.commit();
            res.json(department);
        } catch (e) {
            await transaction.rollback();
            console.error('PATCH ERROR:', e);
            next(ApiError.internal(e.message));
        }
    }

    async deleteRegDepart(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;

            const department = await RegistrationDepart.findByPk(id, { transaction });
            if (!department) {
                throw ApiError.notFound('Department not found');
            }

            const hasEmployees = await Employee.findOne({
                where: { unitCode: department.unitCode },
                transaction
            });

            if (hasEmployees) {
                throw ApiError.badRequest('Cannot delete department: employees are still assigned');
            }

            await department.destroy({ transaction });

            await transaction.commit();
            res.status(204).send();
        } catch (e) {
            await transaction.rollback();
            console.error('DELETE ERROR:', e);
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new RegDepartCrudController();