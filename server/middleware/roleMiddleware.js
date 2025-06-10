const ApiError = require('../error/ApiError');

module.exports = function (requiredRoles) {
    return function (req, res, next) {
        if (!req.user) {
            return next(ApiError.unauthorized('Пользователь не авторизован'));
        }

        if (!requiredRoles.includes(req.user.role)) {
            return next(ApiError.forbidden('Нет доступа'));
        }

        next();
    };
};
