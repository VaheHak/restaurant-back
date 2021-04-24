import {Model, DataTypes} from 'sequelize';
import md5 from 'md5';
import db from '../config/db';

class Users extends Model {
    static passwordHash = (pass) => md5(md5(`${pass}_test`))
}

Users.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 2,
    },
    activation_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'active_code',
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue('password', Users.passwordHash(val));
        },
        get() {
            return undefined;
        },
    },
}, {
    sequelize: db,
    tableName: 'users',
    modelName: 'users',
});

export default Users;
