'use strict';
module.exports = (sequelize, DataTypes) => {
    var Task = sequelize.define('tasks', {
        id: {
              type: DataTypes.INTEGER,
              autoIncrement: true,
              primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        sdate: DataTypes.DATE,
        edate: DataTypes.DATE,
        pid: DataTypes.INTEGER,
        uid: DataTypes.INTEGER
    });

    // Project.associate = function (models) {
    //     models.Task.belongsTo(models.Task, {
    //         onDelete: "CASCADE",
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     });
    // };

    return Task;
};