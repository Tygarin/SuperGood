const Router = require("express");
const controller = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.post("/createMessage", authMiddleware, controller.createMessage);
router.get("/messages/:chatID", authMiddleware, controller.getMessages);
router.post("/deleteMessages", authMiddleware, controller.deleteMessages);

module.exports = router;
