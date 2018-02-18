'use strict';
module.exports = (sequelize, DataTypes) => {
    const task = sequelize.define('tasks',
        {
            id: {
                  type: DataTypes.INTEGER,
                  autoIncrement: true,
                  primaryKey: true
            },
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            sdate: DataTypes.DATEONLY,
            edate: DataTypes.DATEONLY,
        });

        task.associate = function (models) {
            task.belongsTo(models.projects, {
                targetkey: 'id',
                foreignKey: {
                    name: 'pid',
                    allowNull: true,
                },
                constraints: false
            });

            task.belongsTo(models.users,{
                foreignKey: {
                    name: 'uid',
                    allowNull: false
                }
            });

            task.hasOne(models.linktasks,{
                foreignKey: {
                    name: 'basetask_id',
                    allowNull: false
                }
            });

            task.hasOne(models.linktasks,{
                foreignKey: {
                    name: 'linktask_id',
                    allowNull: false
                }
            });
        };

    return task;
};