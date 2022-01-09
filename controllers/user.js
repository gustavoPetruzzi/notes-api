const { validationResult } = require('express-validator/check');
const handleError = require('../utils/error-handler');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const users = await User.findAll();
    const filteredUsers = users.map(user => {
      return {
        id: user.id,
        nickname: user.nickname
      }
    })
    return res.status(200).json({ users });
  } catch (error) {
    return handleError(res, error);
  }
}
