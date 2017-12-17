'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    });

    // Project.associate = function (models) {
    //     models.Task.belongsTo(models.Task, {
    //         onDelete: "CASCADE",
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     });
    // };

    return User;
};