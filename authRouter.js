const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");

router.post(
  "/registration",
  [
    check(
      "userIdentify",
      "Идентификатор пользователя не может быть пустым"
    ).notEmpty(),
    check(
      "password",
      "Пароль должен быть больше 5 и меньше 20 символов"
    ).isLength({ min: 5, max: 20 }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers);

module.exports = router;
