import {Model, DataTypes} from 'sequelize';
import db from '../config/db';

class Categories extends Model {

}

Categories.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const image = this.getDataValue('images');
            return `${global.serverUrl}/images/categories/${image}`;
        },
    },
}, {
    sequelize: db,
    tableName: 'categories',
    modelName: 'categories',
});

export default Categories;
