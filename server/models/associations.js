const User = require('./User');
const TransportVehicle = require('./TransportVehicle');
const RegistrationOp = require('./RegistrationOp');
const RegistrationDoc = require('./RegistrationDoc');
const Owner = require('./Owner');
const NaturalPerson = require('./NaturalPerson');
const LegalEntity = require('./LegalEntity');
const RegistrationDepart = require('./RegistrationDepart');
const Employee = require('./Employee');
const Work = require('./Work');


User.belongsTo(NaturalPerson, { foreignKey: 'passportData', targetKey: 'passportData', constraints: false });
User.belongsTo(LegalEntity, { foreignKey: 'taxNumber', targetKey: 'taxNumber', constraints: false });
User.belongsTo(Employee, { foreignKey: 'badgeNumber', targetKey: 'badgeNumber', constraints: false });

NaturalPerson.hasOne(User, { foreignKey: 'passportData', sourceKey: 'passportData' });
LegalEntity.hasOne(User, { foreignKey: 'taxNumber', sourceKey: 'taxNumber' });
Employee.hasOne(User, { foreignKey: 'badgeNumber', sourceKey: 'badgeNumber' });

Owner.hasOne(NaturalPerson, { foreignKey: 'address' });
Owner.hasOne(LegalEntity, { foreignKey: 'address' });
Owner.hasMany(RegistrationDoc, { foreignKey: 'address' });

NaturalPerson.belongsTo(Owner, { foreignKey: 'address' });
LegalEntity.belongsTo(Owner, { foreignKey: 'address' });
RegistrationDoc.belongsTo(Owner, { foreignKey: 'address' });

TransportVehicle.hasMany(RegistrationOp, { foreignKey: 'vin' });
RegistrationOp.belongsTo(TransportVehicle, { foreignKey: 'vin' });

RegistrationDoc.hasMany(RegistrationOp, { foreignKey: 'registrationNumber' });
RegistrationOp.belongsTo(RegistrationDoc, { foreignKey: 'registrationNumber' });

RegistrationDepart.hasMany(Employee, { foreignKey: 'unitCode' });
RegistrationDepart.hasMany(RegistrationOp, { foreignKey: 'unitCode' });

Employee.belongsTo(RegistrationDepart, { foreignKey: 'unitCode' });
RegistrationOp.belongsTo(RegistrationDepart, { foreignKey: 'unitCode' });

Employee.hasMany(Work, { foreignKey: 'badgeNumber' });
Work.belongsTo(Employee, { foreignKey: 'badgeNumber' });

RegistrationOp.hasMany(Work, { foreignKey: 'operationId' });
Work.belongsTo(RegistrationOp, { foreignKey: 'operationId' });

module.exports = {
    TransportVehicle,
    RegistrationOp,
    RegistrationDoc,
    Owner,
    NaturalPerson,
    LegalEntity,
    RegistrationDepart,
    Employee,
    Work,
    User
};