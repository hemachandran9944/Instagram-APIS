const {DataTypes} = require('sequelize');
const{sequelize } = require('../Config/PostgryQL');


const User = sequelize.define('UserProfile', {
    id:({
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }),
    Bio: ({
        type: DataTypes.TEXT,
        allowNull: true,
    }),
    ProfileImgage: ({
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default.jpg'
    }),
    isVerified: ({
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }),
    isPrivate: ({
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }),
    FollwersCount: ({
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }),
    FollowingCount: ({
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }),
    PostsCount: ({
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }),
}, {timestamps: true, tableName: 'users',})

module.exports = User