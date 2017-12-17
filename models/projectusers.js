'use strict';
module.exports = (sequelize, DataTypes) => {
    var ProjectUser = sequelize.define('project_users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pid: DataTypes.INTEGER,
        uid: DataTypes.INTEGER,
    });

    // Project.associate = function (models) {
    //     models.Task.belongsTo(models.Task, {
    //         onDelete: "CASCADE",
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     });
    // };

    return ProjectUser;
};