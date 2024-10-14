const Chat = require("./models/Chat");

class ChatController {
  async createChat(req, res) {
    try {
      const { members, name } = req.body;
      const chat = new Chat({
        members: [...members, req.user.id],
        name,
        createdByUserID: req.user.id,
      });
      if (members.length < 1) {
        return res.status(400).json({
          message: "Количество пользователей должно быть больше одного",
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
      res.json(
        chats.filter(
          (chat) =>
            chat.members.includes(req.user.id) ||
            chat.createdByUserID === req.user.id
        )
      );
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Get chats error" });
    }
  }
  async getChat(req, res) {
    try {
      const chat = await Chat.findById(req.params.id);
      if (
        chat.members.includes(req.user.id) ||
        chat.createdByUserID === req.user.id
      ) {
        res.json(chat);
      } else {
        return res.status(400).json({
          message: "Чат не найден",
        });
      }
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
