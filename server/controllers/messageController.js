const Message = require("../models/Message");

class MessageController {
  async createMessage(req, res) {
    try {
      const senderID = req.user.id;
      const { chatID, text } = req.body;

      const message = new Message({
        senderID,
        chatID,
        text,
      });

      await message.save();
      return res.json(message);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Create message error" });
    }
  }

  async getMessages(req, res) {
    try {
      const { chatID } = req.params;
      const messages = await Message.find({ chatID });
      res.json(messages);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Get messages error" });
    }
  }
}

module.exports = new MessageController();
