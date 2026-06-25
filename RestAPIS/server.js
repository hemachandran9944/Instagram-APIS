require('dotenv').config();
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const {ConntecPgDB, sequelize} = require('./Config/PostgryQL');
const {helmetConfig, ratelimitConfig} = require('./Config/Security');
const {AuthorizationTokenVerify} = require('./Setting/Oautho');
const jwt = require('jsonwebtoken');

const UserRegister = require('./Routes/UserRoutes');
const UserProfileDB = require('./Routes/UserProfileRoutes');
const MessageRoutres = require('./Routes/MessageRoutes');

const MessageController = require('./Controller/messageController');

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
app.use('/api/chatHistory', MessageRoutres);

app.use((req, res)=>{
    res.status(404).json({status: 'Failed', message: 'Route not found! Please check your URL request method.'});
});

const PORT = process.env.PORT||8500
const serverIO = http.createServer(app) 
const io = new Server(serverIO, {
    cors: {
        origin: "*"
    }
});


io.use((socket, next) => {
try { 
        const token = socket.handshake.auth.token || socket.handshake.query.token;

        if (!token) {
            console.log(` Connection Rejected: Token missing for socket ${socket.id}`);
            return next(new Error('Authentication error: JWT token missing!'));
        }
        const decoded = jwt.verify(token, process.env.JsonWebToken);
        socket.user = decoded; 
        next();
    } catch (error) {
        console.log('User JWT token handshake error:', error.message);
        return next(new Error('Authentication error: Invalid Token!'));
    }
});




io.on('connection', (socket)=>{
    console.log(`A user connected: ${socket.id}`)
    if (socket.user && socket.user.id) {
        socket.join(socket.user.id.toString());
        console.log(`User ${socket.user.id} successfully joined room: ${socket.user.id}`);
    }
    MessageController.LiveChat(io, socket);
    socket.on('disconnect', ()=>{
        console.log(`User disconnected: ${socket.id}`);
    });
});



const StartServer = async ()=>{
    try {
        await ConntecPgDB();
        //await sequelize.sync({ force: true, alter: true });
        await sequelize.sync({ alter: true });
        console.log('Table create sucessfulley');
        serverIO.listen(PORT, ()=>{
            console.log(`Server running on port ${PORT}`)
        });
    } catch (error) {
        console.log('Server Error', error.message);
    }
};


StartServer();
