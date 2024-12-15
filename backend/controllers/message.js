const Message = require('../models/message');
const Conversation = require('../models/conversation');


exports.sendMessage = async (req, res) => {
  
    
    try {
        const {message} = req.body;
        const {id:receiver} = req.params;
        const sender = req.user.id;
       
        let conversation = await Conversation.findOne({
			participants: { $all: [sender, receiver] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [sender, receiver],
			});
		}
        const newMessage = new Message({
            sender,
            receiver,
            content: message, // Ensure the property name matches the schema
        });
        if (newMessage){
            conversation.messages.push(newMessage._id);
        }
        await Promise.all([conversation.save(),newMessage.save()]);
        const io = req.app.get('io');
        if (receiver) {
            io.to(receiver).emit('newMessage', newMessage);
        }
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
}

exports.getMessages = async (req, res) => {

	try {
		const { id: receiver } = req.params || null;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiver] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};		