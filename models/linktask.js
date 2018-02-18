'use strict';
module.exports = (sequelize, DataTypes) => {
    const linktasks = sequelize.define('linktasks',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            }
        });

    linktasks.associate = function (models) {
        linktasks.belongsTo(models.tasks, {
            targetkey: 'id',
            foreignKey: {
                name: 'basetask_id',
                allowNull: true,
            },
            constraints: false
        });

        linktasks.belongsTo(models.tasks,{
            foreignKey: {
                name: 'linktask_id',
                allowNull: false
            }
        });
    };

    return linktasks;
};