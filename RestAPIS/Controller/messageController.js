const message = require('../Modules/Messager');
const User = require('../Modules/User');
const {Opreaters} = require('sequelize');

exports.LiveChat = async (socketServer, socket) => {
    try {
        console.log(`LiveChat instance linked for user: ${socket.id}`);
        socket.on('Typeinf Status', (data)=>{
            const{SenderId, ReceiverId} = data;
        });
    } catch (error) {
        console.log('Error live chat controller', error.message);
    }
}


