const { RegistrationDoc, Employee } = require('../../models/associations');
const ApiError = require("../../error/ApiError");
const Joi = require('joi');
const { Op } = require('sequelize');

const regDocSchema = Joi.object({
    registrationNumber: Joi.string().pattern(/^[A-Z0-9]{8,20}$/).required(),
    address: Joi.string().min(5).max(255).required(),
    pts: Joi.string().pattern(/^[A-Z0-9]{10,20}$/).required(),
    sts: Joi.string().pattern(/^[A-Z0-9]{10,20}$/).required(),
    registrationDate: Joi.date().iso().required()
});

class RegDocCrudController {
    async getAllRegDoc(req, res, next) {
        try {
            const { error } = Joi.object({
                limit: Joi.number().integer().min(1).max(100).default(10),
                page: Joi.number().integer().min(1).default(1),
                search: Joi.string().optional()
            }).validate(req.query);

            if (error) throw ApiError.badRequest(error.details[0].message);

            const { limit, page, search } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (search) {
                where[Op.or] = [
                    { registrationNumber: { [Op.like]: `%${search}%` }},
                    { pts: { [Op.like]: `%${search}%` }},
                    { sts: { [Op.like]: `%${search}%` }}
                ];
            }

            const { count, rows } = await RegistrationDoc.findAndCountAll({
                where,
                limit,
                offset,
                order: [['registrationDate', 'DESC']],
                attributes: ['registrationNumber', 'address', 'pts', 'sts', 'registrationDate']
            });

            res.json({
                total: count,
                pages: Math.ceil(count / limit),
                currentPage: +page,
                data: rows
            });
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async getRegDocById(req, res, next) {
        try {
            const { id } = req.params;

            if (!/^[A-Z0-9]{8,20}$/.test(id)) {
                throw ApiError.badRequest('Invalid registration number format');
            }

            const doc = await RegistrationDoc.findOne({
                where: { registrationNumber: id },
                include: [{
                    model: Employee,
                    attributes: ['badgeNumber', 'firstName', 'lastName']
                }]
            });

            if (!doc) {
                throw ApiError.notFound('Registration document not found');
            }

            res.json(doc);
        } catch (e) {
            next(e);
        }
    }

    async createRegDoc(req, res, next) {
        try {
            const { error } = regDocSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const existingDoc = await RegistrationDoc.findOne({
                where: { registrationNumber: req.body.registrationNumber }
            });

            if (existingDoc) {
                throw ApiError.conflict('Document with this registration number already exists');
            }

            const newDoc = await RegistrationDoc.create(req.body, {
                returning: true,
                fields: ['registrationNumber', 'address', 'pts', 'sts', 'registrationDate']
            });

            res.status(201).json(newDoc);
        } catch (e) {
            next(e);
        }
    }

    async updateRegDoc(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = regDocSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const doc = await RegistrationDoc.findByPk(id);
            if (!doc) {
                throw ApiError.notFound('Document not found');
            }

            if (req.body.registrationNumber && req.body.registrationNumber !== id) {
                throw ApiError.badRequest('Cannot change registration number');
            }

            await doc.update(req.body, {
                fields: ['address', 'pts', 'sts', 'registrationDate']
            });

            res.json(doc);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new RegDocCrudController();