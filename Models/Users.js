module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nom: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        prenom: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        email: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        cles_securite: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    });
    return User;
};


