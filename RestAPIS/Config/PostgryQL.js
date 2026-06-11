const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.PostgresURL||'postgresql://postgres:9944@localhost:5432/Instagram_APIS' , {
    dialect: 'postgres',
    logging: false,
});

const ConntecPgDB = async () =>{
    try {
        await sequelize.authenticate();
        console.log('PostgreySQL Connected!');
    } catch (error) {
        console.log('PostgreySQL Error', error);
    }
};


module.exports = {sequelize, ConntecPgDB};
