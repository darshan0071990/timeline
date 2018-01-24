'use strict';
module.exports = (sequelize, DataTypes) => {
    const project = sequelize.define('projects',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING,
            color: DataTypes.STRING,
        });

        project.associate = function (models) {
            project.hasMany(models.tasks, {
                foreignKey: {
                    name: 'pid',
                    allowNull: true
                }
            });
        };

    return project;
};