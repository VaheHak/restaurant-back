import {Model, DataTypes} from 'sequelize';
import db from '../config/db';

class Menus extends Model {

}

Menus.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    restId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    catId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const menuId = this.getDataValue('id');
            const image = this.getDataValue('image');
            return `${global.serverUrl}/images/menus/${menuId}/${image}`;
        },
    },
}, {
    sequelize: db,
    tableName: 'menus',
    modelName: 'menus',
});

export default Menus;
