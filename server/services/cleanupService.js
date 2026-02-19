const { NaturalPerson, User, RegistrationDoc, LegalEntity, Owner } = require('../models/associations');
const { Op } = require('sequelize');
const sequelize = require('../db');

const cleanupUnverifiedRecords = async () => {
    const transaction = await sequelize.transaction();
    try {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const elevenMinutesAgo = new Date(now.getTime() - 11 * 60 * 1000);

        const oldNaturalPersons = await NaturalPerson.findAll({
            where: {
                createdAt: {
                    [Op.between]: [elevenMinutesAgo, fiveMinutesAgo]
                }
            },
            transaction
        });

        if (oldNaturalPersons.length > 0) {
            const passportDataList = oldNaturalPersons.map(p => p.passportData);

            const [existingUsers, existingRegDocs] = await Promise.all([
                User.findAll({
                    where: { passportData: { [Op.in]: passportDataList } },
                    attributes: ['passportData'],
                    transaction
                }),
                RegistrationDoc.findAll({
                    where: { 
                        documentOwner: { 
                            [Op.in]: passportDataList  
                        } 
                    },
                    attributes: ['documentOwner'],
                    transaction
                })
            ]);

            const linkedPassportData = new Set([
                ...existingUsers.map(u => u.passportData),
                ...existingRegDocs.map(d => d.documentOwner)
            ]);

            const addressesToCheck = new Set();

            for (const person of oldNaturalPersons) {
                if (!linkedPassportData.has(person.passportData)) {
                    addressesToCheck.add(person.address);
                    await person.destroy({ transaction });
                }
            }

            if (addressesToCheck.size > 0) {
                await checkAndDeleteOwners(addressesToCheck, transaction);
            }
        }

        const oldLegalEntities = await LegalEntity.findAll({
            where: {
                createdAt: {
                    [Op.between]: [elevenMinutesAgo, fiveMinutesAgo]
                }
            },
            transaction
        });

        if (oldLegalEntities.length > 0) {
            const taxNumberList = oldLegalEntities.map(e => e.taxNumber);

            const [existingUsers, existingRegDocs] = await Promise.all([
                User.findAll({
                    where: { taxNumber: { [Op.in]: taxNumberList } },
                    attributes: ['taxNumber'],
                    transaction
                }),
                RegistrationDoc.findAll({
                    where: { 
                        documentOwner: { 
                            [Op.in]: taxNumberList  
                        } 
                    },
                    attributes: ['documentOwner'],
                    transaction
                })
            ]);

            const linkedTaxNumbers = new Set([
                ...existingUsers.map(u => u.taxNumber),
                ...existingRegDocs.map(d => d.documentOwner)
            ]);

            const addressesToCheck = new Set();

            for (const entity of oldLegalEntities) {
                if (!linkedTaxNumbers.has(entity.taxNumber)) {
                    addressesToCheck.add(entity.address);
                    await entity.destroy({ transaction });
                }
            }

            if (addressesToCheck.size > 0) {
                await checkAndDeleteOwners(addressesToCheck, transaction);
            }
        }

        await transaction.commit();
        
    } catch (error) {
        await transaction.rollback();
        console.error('Cleanup error:', error);
    }
};

const checkAndDeleteOwners = async (addressesToCheck, transaction) => {
    const addressList = Array.from(addressesToCheck);
    
    for (const address of addressList) {
        const naturalPersonsAtAddress = await NaturalPerson.findAll({
            where: { address },
            attributes: ['passportData'],
            transaction
        });
        
        const legalEntitiesAtAddress = await LegalEntity.findAll({
            where: { address },
            attributes: ['taxNumber'],
            transaction
        });
        
        const allIdentifiers = [
            ...naturalPersonsAtAddress.map(p => p.passportData),
            ...legalEntitiesAtAddress.map(e => e.taxNumber)
        ];
        
        let remainingRegDocs = 0;
        if (allIdentifiers.length > 0) {
            remainingRegDocs = await RegistrationDoc.count({
                where: {
                    documentOwner: {
                        [Op.in]: allIdentifiers
                    }
                },
                transaction
            });
        }

        if (naturalPersonsAtAddress.length === 0 && 
            legalEntitiesAtAddress.length === 0 && 
            remainingRegDocs === 0) {
            
            await Owner.destroy({
                where: { address },
                transaction
            });
        }
    }
};

const startCleanupService = () => {
    setTimeout(async () => {
        await cleanupUnverifiedRecords();
        
        setInterval(async () => {
            await cleanupUnverifiedRecords();
        }, 5 * 60 * 1000);
    }, 60 * 1000);
};

module.exports = { startCleanupService, cleanupUnverifiedRecords };