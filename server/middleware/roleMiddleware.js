const ApiError = require('../error/ApiError');

// Middleware для проверки роли
const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            // Получаем роль из токена (она была добавлена при генерации токена)
            const { role } = req.user;
            
            // Проверяем, есть ли у пользователя нужная роль
            if (!roles.includes(role)) {
                return next(ApiError.forbidden('Access denied'));
            }
            
            next();
        } catch (e) {
            next(ApiError.unauthorized('Not authorized'));
        }
    };
};

module.exports = checkRole; 