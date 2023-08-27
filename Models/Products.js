
module.exports = (sequelize, DataTypes) => {
    let Products = sequelize.define("products", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        details_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    });
    let Product_details = require('../Models/Product_details')(sequelize, DataTypes);
    Products.hasOne(Product_details, {
        foreignKey: 'id',
        sourceKey: 'details_id'
    });
    return Products;
};


