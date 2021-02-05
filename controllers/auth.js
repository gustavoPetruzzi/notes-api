const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const handlerError = require('../utils/error-handler');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  const email = req.body.email;
  const nickName = req.body.nickName;
  const password = req.body.password;
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    if (user) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      email,
      password: hashedPassword,
      nickName
    });
    return res.status(201).json({
      message: 'User created.'
    });
  } catch (error) {
    return handlerError(res, error);
  }
}

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  try {
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser.id.toString()
      },
      'secret',
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      token,
      userId: loadedUser.id.toString()
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
    return error;
  }
}
