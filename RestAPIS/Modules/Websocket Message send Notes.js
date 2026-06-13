// User → SentMessages
Users.hasMany(Message, { as: 'SentMessages' });

// User → ReceivedMessages
Users.hasMany(Message, { as: 'ReceivedMessages' });

// Message → SenderFind
Message.belongsTo(Users, { as: 'Sender' });

// Message → ReceiverFind
Message.belongsTo(Users, { as: 'Receiver' });