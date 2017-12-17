'use strict';
module.exports = (sequelize, DataTypes) => {
    const project = sequelize.define('projects', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        color: DataTypes.STRING
    });

    // Project.associate = function (models) {
    //     models.Task.belongsTo(models.Task, {
    //         onDelete: "CASCADE",
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     });
    // };

    return project;
};