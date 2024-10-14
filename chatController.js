const Chat = require("./models/Chat");
const User = require("./models/User");

class ChatController {
  async createChat(req, res) {
    try {
      const { members, name } = req.body;
      const user = await User.findById(req.user.id);
      const chat = new Chat({
        members: [...members, user.userIdentify],
        name,
        createdByUserIdentify: user.userIdentify,
      });
      if (members.length < 2) {
        return res.status(400).json({
          message: "Количество пользователей должно быть больше двух",
        });
      }
      await chat.save();
      return res.json(chat);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Create chat error" });
    }
  }
  async getChats(req, res) {
    try {
      const chats = await Chat.find();
      res.json(chats);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Get chats error" });
    }
  }
  async getChat(req, res) {
    try {
      const chat = await Chat.findById(req.params.id);
      res.json(chat);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Get chat error" });
    }
  }
  async deleteChat(req, res) {
    try {
      const chat = await Chat.findByIdAndDelete(req.params.id);
      res.json(chat);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Delete chat error" });
    }
  }
}

module.exports = new ChatController();
