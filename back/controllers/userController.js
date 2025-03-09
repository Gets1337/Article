import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail, getUserById } from '../models/user.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const { email, fullName } = req.body;

    const user = await createUser(fullName, email, passwordHashed);

    const token = jwt.sign(
      {
        _id: user.id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    const { password: _, ...userData } = user;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);

    res.status(500).json({ massage: 'Не удалось зарегестрироваться' });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPass) {
      return res.status(404).json({ message: 'Неверный логин или пароль' });
    }
    const token = jwt.sign(
      {
        _id: user.id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );
    const { password: _, ...userData } = user;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const { password: _, ...userData } = user;

    res.json({ ...userData});
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: 'Нет доступа',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const logout = async (req, res) => {
  try {
    jwt.sign({ userId: req.userId }, 'secret123', { expiresIn: '0m' });
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: 'Нет доступа',
    });
  }
};


