    const {DataTypes} = require('sequelize');
    const{sequelize } = require('../Config/PostgryQL');
    const bcryptHash = require('bcrypt');


    const Users = sequelize.define('UserResgister', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Gmail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            },
        },
        Age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100]
            }
        },
        Otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        OTPExpiration: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {timestamps: true, tableName: 'users',})


Users.addHook('beforeCreate', async (user) => {
    user.Password = await bcryptHash.hash(user.Password, 10);
});


module.exports = Users;