const MessageModel = require('../Modules/Messager');
const User = require('../Modules/User');
const { Op } = require('sequelize');

exports.LiveChat = async (socketServer, socket) => {
    try {
        console.log(`LiveChat instance linked for user: ${socket.id}`);

        socket.on('send message', async (data) => {
            try {

                const {receiverId, messageText} = data;
                const senderId = socket.user?.id;

                if (!receiverId || !messageText) {
                    console.log('Validation failed: receiverId or messageText missing');
                    return;
                }

                console.log(`Message received from ${senderId} to ${receiverId}: ${messageText}`);

                const newChat = await MessageModel.create({
                    SenderId: senderId,
                    ReceiverId: receiverId,
                    Message: messageText,
                    isSeen: false
                });

                socketServer.to(receiverId.toString()).emit('receive message', {
                    id: newChat.id,
                    SenderId: senderId,
                    ReceiverId: receiverId,
                    Message: messageText,
                    createdAt: newChat.createdAt
                });

                console.log(`Message safely saved to DB (ID: ${newChat.id}) and emitted! successfully!`);

            } catch (dbError) {
                console.log('Error saving/emitting chat message:', dbError.message);
            }
        });

        socket.on('Typeing Status', (data) => {
            const { SenderId, ReceiverId } = data;
            if (!ReceiverId) return;

            socketServer.to(ReceiverId.toString()).emit('User Typing', {
                SenderId: SenderId,
                typing: true
            });
            console.log(`User ${SenderId} is typing to ${ReceiverId}`);
        });

        socket.on('stop typeing status', (data) => {
            try {
                const { SenderId, ReceiverId } = data;
                if (!ReceiverId) return;
                
                socketServer.to(ReceiverId.toString()).emit('User Typeing', {
                    SenderId: SenderId,
                    typing: false
                });
                console.log(`User ${SenderId} stopped typing to ${ReceiverId}`);
            } catch (innerError) {
                console.log('Error inside stop typing event:', innerError.message);
            }
        });

    } catch (error) {
        console.log('Error live chat controller', error.message);
    }
};




// GetChatHistory
exports.GetChatHistory = async (req, res) => {
    try {
        const UserId = req.user.id;
        const {UserChatId} = req.params;
        
        const chat = await MessageModel.findAll({
            where: {
                [Op.or]: [
                    {SenderId: UserId, ReceiverId: UserChatId},
                    {SenderId: UserChatId, ReceiverId: UserId}
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        return res.status(200).json({status: 'Success', message: 'Get chathistory successfulley!', data: chat});
    } catch (error) {
        return res.status(500).json({status: 'Failed', message: error.message});
    }
};