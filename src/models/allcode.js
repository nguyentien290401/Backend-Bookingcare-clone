'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AllCode extends Model {
        static associate(models) {
            // define association here
            AllCode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' });
            AllCode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' });
            AllCode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' });

        }
    };

    AllCode.init({
        keyMap: DataTypes.STRING,
        type: DataTypes.STRING,
        valueEn: DataTypes.STRING,
        valueVi: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'AllCode',
    });

    return AllCode;
};
