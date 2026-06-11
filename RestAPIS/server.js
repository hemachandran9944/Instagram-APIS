require('dotenv').config();
const express = require('express');
const {ConntecPgDB, sequelize} = require('./Config/PostgryQL');
const {helmetConfig, ratelimitConfig} = require('./Config/Security');

const UserRegister = require('./Routes/UserRoutes');
const UserProfileDB = require('./Routes/UserProfileRoutes');


const app = express();
app.use(helmetConfig);
app.use(ratelimitConfig);


app.use(express.json());
app.use((req, res, next)=>{
    console.log(`${req.method} Request to ${req.url}`);
    next();
});


app.use('/api/user', UserRegister);
app.use('/api/userprofile', UserProfileDB);

app.use((req, res)=>{
    res.status(404).json({status: 'Failed', message: 'Route not found! Please check your URL request method.'});
});

const StartServer = async ()=>{
    try {
        await ConntecPgDB();
        //await sequelize.sync({ force: true, alter: true });
        await sequelize.sync({ force: true });
        console.log('Table create sucessfulley');
        

        const PORT = process.env.PORT||8000
        app.listen(PORT, ()=>{
            console.log(`Server running on port ${PORT}`)
        });

    } catch (error) {
        console.log('Server Error', error.message);
    }
};

StartServer();
