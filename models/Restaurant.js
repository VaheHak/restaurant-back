import {Model, DataTypes} from 'sequelize';
import db from '../config/db';

class Restaurant extends Model {

}

Restaurant.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const restId = this.getDataValue('id');
            const logo = this.getDataValue('logo');
            return `${global.serverUrl}/images/restaurants/${restId}/${logo}`;
        },
    },
}, {
    sequelize: db,
    tableName: 'restaurant',
    modelName: 'restaurant',
});

export default Restaurant;
