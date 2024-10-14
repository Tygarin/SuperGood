const Router = require("express");
const controller = require("./chatController");
const authMiddleware = require("./middleware/authMiddleware");
const { check } = require("express-validator");

const router = new Router();

router.post(
  "/createChat",
  [
    authMiddleware,
    check(
      "name",
      "Название чата не может быть пустым"
    ).notEmpty(),
  ],
  controller.createChat
);
router.get("/chats", authMiddleware, controller.getChats);
router.get("/chat/:id", authMiddleware, controller.getChat);
router.delete("/chat/:id", authMiddleware, controller.deleteChat);

module.exports = router;
