'use strict';
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING
        });

        users.associate = function (models) {
            users.hasMany(models.tasks, {
                foreignKey: {
                    name: 'uid',
                    allowNull: false
                },
                constraints: false
            });
        };

    return users;
};