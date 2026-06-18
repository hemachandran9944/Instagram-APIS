const express = require('express');
const router  = express.Router();
const {AuthorizationTokenVerify} = require('../Setting/Oautho');

const MessageController = require('../Controller/messageController');

router.get('/getChatHistory/:UserChatId', AuthorizationTokenVerify, MessageController.GetChatHistory);


module.exports = router;
