'use strict';
module.exports = (sequelize, DataTypes) => {
    var TaskUser = sequelize.define('task_users', {
        tid: DataTypes.INTEGER,
        pu_id: DataTypes.INTEGER
    });

    // Project.associate = function (models) {
    //     models.Task.belongsTo(models.Task, {
    //         onDelete: "CASCADE",
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     });
    // };

    return TaskUser;
};