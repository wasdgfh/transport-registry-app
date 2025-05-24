const { User } = require('../models/associations');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const sequelize = require('../db');

// Схема валидации для регистрации
const registrationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
    role: Joi.string().valid('user', 'employee', 'admin').required()
});

// Схема валидации для входа
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

class UserController {
    /**
     * Generate JWT token
     * @param {number} id - User ID
     * @param {string} email - User email
     * @param {string} role - User role
     * @returns {string} JWT token
     */
    generateToken(id, email, role) {
        return jwt.sign(
            { id, email, role },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );
    }

    /**
     * User registration
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async registration(req, res, next) {
        const transaction = await sequelize.transaction();
        
        try {
            // Валидация входных данных
            const { error } = registrationSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const { email, password, role } = req.body;

            // Проверка на существование пользователя
            const existingUser = await User.findOne({
                where: { email },
                transaction
            });

            if (existingUser) {
                throw ApiError.conflict('User with this email already exists');
            }

            // Хеширование пароля
            const hashedPassword = await bcrypt.hash(password, 5);

            // Создание пользователя
            const user = await User.create({
                email,
                password: hashedPassword,
                role,
                isActive: true
            }, {
                transaction
            });

            // Генерация токена
            const token = this.generateToken(user.id, user.email, user.role);

            await transaction.commit();

            // Отправка ответа без пароля
            const { password: _, ...userWithoutPassword } = user.toJSON();
            res.status(201).json({
                user: userWithoutPassword,
                token
            });
        } catch (e) {
            await transaction.rollback();
            next(e);
        }
    }

    /**
     * User login
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async login(req, res, next) {
        try {
            // Валидация входных данных
            const { error } = loginSchema.validate(req.body);
            if (error) throw ApiError.badRequest(error.details[0].message);

            const { email, password } = req.body;

            // Поиск пользователя
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw ApiError.unauthorized('Invalid email or password');
            }

            // Проверка активности пользователя
            if (!user.isActive) {
                throw ApiError.forbidden('Account is deactivated');
            }

            // Проверка пароля
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw ApiError.unauthorized('Invalid email or password');
            }

            // Генерация токена
            const token = this.generateToken(user.id, user.email, user.role);

            // Отправка ответа без пароля
            const { password: _, ...userWithoutPassword } = user.toJSON();
            res.json({
                user: userWithoutPassword,
                token
            });
        } catch (e) {
            next(e);
        }
    }

    /**
     * Check user authorization
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async check(req, res, next) {
        try {
            // Получение пользователя из middleware auth
            const user = await User.findByPk(req.user.id);
            if (!user) {
                throw ApiError.unauthorized('User not found');
            }

            // Проверка активности пользователя
            if (!user.isActive) {
                throw ApiError.forbidden('Account is deactivated');
            }

            // Генерация нового токена
            const token = this.generateToken(user.id, user.email, user.role);

            // Отправка ответа без пароля
            const { password: _, ...userWithoutPassword } = user.toJSON();
            res.json({
                user: userWithoutPassword,
                token
            });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();