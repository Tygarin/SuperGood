const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");

router.post(
  "/registration",
  [
    authMiddleware,
    check(
      "userIdentify",
      "Идентификатор пользователя не может быть пустым"
    ).notEmpty(),
    check(
      "password",
      "Пароль должен быть больше 2 и меньше 20 символов"
    ).isLength({ min: 2, max: 20 }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers);
router.get("/user", authMiddleware, controller.getUser);
router.get("/user/:id", authMiddleware, controller.getChatByID);
router.delete("/user/:id", authMiddleware, controller.deleteUser);

module.exports = router;
