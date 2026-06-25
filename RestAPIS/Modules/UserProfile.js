const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/PostgryQL');
const Users = require('./User');

const UserProfile = sequelize.define('UserProfile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Bio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    DPImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        unique: true,
        references: {
            model: Users, 
            key: 'id',
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'UserProfile',
    timestamps: true
});

module.exports = UserProfile;