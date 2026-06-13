const {DataTypes} = require('sequelize');
const{sequelize } = require('../Config/PostgryQL');
const User = require('./User');


const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    SenderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    ReceiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    Message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isSeen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {timestamps: true,  tableName: 'messages'});


//User.hasMany(Message, {foreignKey: 'SenderId', as: 'SentMessages'});