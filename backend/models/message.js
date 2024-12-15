const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: { type : mongoose.Schema.Types.ObjectId, ref: 'user' },
    receiver: { type : mongoose.Schema.Types.ObjectId, ref: 'user' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;