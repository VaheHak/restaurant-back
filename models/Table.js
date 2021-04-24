import {Model, DataTypes} from 'sequelize';
import db from '../config/db';

class Table extends Model {

}

Table.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    restId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: db,
    tableName: 'table',
    modelName: 'table',
});

export default Table;