const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { userIdentify, password, role } = req.body;
      const candidate = await User.findOne({ userIdentify });
      if (candidate) {
        return res.status(400).json({
          message: "Пользователь с таким идентификатором уже существует",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: role || "ADMIN" });
      const user = new User({
        userIdentify,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { userIdentify, password } = req.body;
      const user = await User.findOne({ userIdentify });
      if (!user) {
        return res.status(400).json({
          message: `Пользователь с идентификатором ${userIdentify} не найден`,
        });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          message: "Введён неверный пароль",
        });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Get users error" });
    }
  }

  async getUser(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Get user error" });
    }
  }
}

module.exports = new AuthController();
