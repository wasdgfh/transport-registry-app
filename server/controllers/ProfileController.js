const { User, NaturalPerson, LegalEntity, Employee } = require('../models/associations');
const ApiError = require('../error/ApiError');
const { translateError } = require('../error/errorMessage');

class ProfileController {
    async getProfile(req, res, next) {
        try {
            if (!req.user || !req.user.id) {
                throw ApiError.unauthorized(translateError('No user data in request'));
            }

            const user = await User.findOne({ 
                where: { id: req.user.id },
                attributes: { exclude: ['password'] }
            });
            
            if (!user) {
                throw ApiError.notFound(translateError('User not found'));
            }

            let profileData = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            switch (user.role) {
                case 'OWNER':
                    if (user.passportData) {
                        const naturalPerson = await NaturalPerson.findOne({
                            where: { passportData: user.passportData }
                        });
                        if (naturalPerson) {
                            profileData = {
                                ...profileData,
                                ...naturalPerson.toJSON(),
                                type: 'natural'
                            };
                        }
                    } else if (user.taxNumber) {
                        const legalEntity = await LegalEntity.findOne({
                            where: { taxNumber: user.taxNumber }
                        });
                        if (legalEntity) {
                            profileData = {
                                ...profileData,
                                ...legalEntity.toJSON(),
                                type: 'legal'
                            };
                        }
                    }
                    break;

                case 'EMPLOYEE':
                    if (user.badgeNumber) {
                        const employee = await Employee.findOne({
                            where: { badgeNumber: user.badgeNumber }
                        });
                        if (employee) {
                            profileData = {
                                ...profileData,
                                ...employee.toJSON()
                            };
                        }
                    }
                    break;

                case 'ADMIN':
                    profileData = {
                        ...profileData,
                        ...user.toJSON()
                    };
                    break;
            }

            res.json({
                user: profileData
            });

        } catch (e) {
            console.error('PROFILE ERROR:', e);
            if (e instanceof ApiError) {
                next(e);
            } else {
                next(ApiError.internal(translateError('Unexpected error during profile fetch')));
            }
        }
    }
}

module.exports = new ProfileController();